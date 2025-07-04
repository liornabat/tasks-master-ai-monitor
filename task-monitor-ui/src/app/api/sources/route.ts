import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Source } from '@/types';

const SOURCES_DIR = path.join(process.cwd(), 'sources');
const SOURCES_FILE = path.join(SOURCES_DIR, 'sources.json');
const FILES_DIR = path.join(SOURCES_DIR, 'files');

// Ensure directories exist
function ensureDirectories() {
  if (!fs.existsSync(SOURCES_DIR)) {
    fs.mkdirSync(SOURCES_DIR, { recursive: true });
  }
  if (!fs.existsSync(FILES_DIR)) {
    fs.mkdirSync(FILES_DIR, { recursive: true });
  }
}

// Load sources from file
function loadSources(): Source[] {
  ensureDirectories();
  
  if (!fs.existsSync(SOURCES_FILE)) {
    return [];
  }
  
  try {
    const data = fs.readFileSync(SOURCES_FILE, 'utf8');
    const sources = JSON.parse(data);
    
    // Migrate old sources to include originalPath
    let needsSave = false;
    const migratedSources = sources.map((source: Source) => {
      if (!source.originalPath && source.filePath) {
        needsSave = true;
        // For old sources, assume they were uploaded and use the local file path as original
        const fullFilePath = path.join(FILES_DIR, source.filePath);
        return {
          ...source,
          originalPath: fullFilePath,
          isUploaded: true
        };
      }
      return source;
    });
    
    // Save migrated sources if any changes were made
    if (needsSave) {
      saveSources(migratedSources);
    }
    
    return migratedSources;
  } catch (error) {
    console.error('Error loading sources:', error);
    return [];
  }
}

// Save sources to file
function saveSources(sources: Source[]): void {
  ensureDirectories();
  
  try {
    fs.writeFileSync(SOURCES_FILE, JSON.stringify(sources, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving sources:', error);
    throw error;
  }
}

// Validate source files and mark errors
function validateSources(sources: Source[]): Source[] {
  return sources.map(source => {
    let hasError = false;
    let errorMessage: string | undefined;

    // Check original path first
    if (!fs.existsSync(source.originalPath)) {
      hasError = true;
      errorMessage = 'Original file not found';
      
      // For uploaded files, check if backup exists
      if (source.isUploaded && source.filePath) {
        const backupPath = path.join(FILES_DIR, source.filePath);
        if (fs.existsSync(backupPath)) {
          hasError = false;
          errorMessage = 'Using backup copy (original file not found)';
        }
      }
    } else {
      // Check if file is readable
      try {
        fs.accessSync(source.originalPath, fs.constants.R_OK);
      } catch {
        hasError = true;
        errorMessage = 'File not readable';
      }
    }
    
    return {
      ...source,
      hasError,
      errorMessage
    };
  });
}

export async function GET() {
  try {
    const sources = loadSources();
    const validatedSources = validateSources(sources);
    
    // Save back if any errors were detected
    if (validatedSources.some(s => s.hasError !== sources.find(orig => orig.id === s.id)?.hasError)) {
      saveSources(validatedSources);
    }
    
    return NextResponse.json({ sources: validatedSources });
  } catch (error) {
    console.error('Error fetching sources:', error);
    return NextResponse.json({ message: 'Failed to fetch sources' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const specifiedPath = formData.get('filePath') as string;
    const name = formData.get('name') as string;

    if (!file && !specifiedPath) {
      return NextResponse.json({ message: 'Either file upload or file path is required' }, { status: 400 });
    }

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ message: 'Source name is required' }, { status: 400 });
    }

    // Check for duplicate names
    const existingSources = loadSources();
    if (existingSources.some(s => s.name.toLowerCase() === name.trim().toLowerCase())) {
      return NextResponse.json({ message: 'Source name already exists' }, { status: 400 });
    }

    const sourceId = uuidv4();
    let newSource: Source;

    if (file) {
      // Handle file upload
      if (!file.name.endsWith('.json')) {
        return NextResponse.json({ message: 'File must be a JSON file' }, { status: 400 });
      }

      const fileContent = await file.text();
      
      try {
        JSON.parse(fileContent);
      } catch {
        return NextResponse.json({ message: 'Invalid JSON file' }, { status: 400 });
      }

      // Save file locally as backup
      ensureDirectories();
      const fileName = `${sourceId}.json`;
      const fullFilePath = path.join(FILES_DIR, fileName);
      fs.writeFileSync(fullFilePath, fileContent, 'utf8');

      newSource = {
        id: sourceId,
        name: name.trim(),
        fileName: file.name,
        filePath: fileName,
        originalPath: fullFilePath, // For uploaded files, original path is the local copy
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString(),
        isUploaded: true
      };
    } else {
      // Handle file path specification
      const absolutePath = path.resolve(specifiedPath);
      
      // Validate path exists and is accessible
      if (!fs.existsSync(absolutePath)) {
        return NextResponse.json({ message: 'Specified file path does not exist' }, { status: 400 });
      }

      // Validate it's a JSON file
      if (!absolutePath.endsWith('.json')) {
        return NextResponse.json({ message: 'File must be a JSON file' }, { status: 400 });
      }

      // Validate JSON content
      try {
        const fileContent = fs.readFileSync(absolutePath, 'utf8');
        JSON.parse(fileContent);
      } catch {
        return NextResponse.json({ message: 'Invalid JSON file or unable to read file' }, { status: 400 });
      }

      newSource = {
        id: sourceId,
        name: name.trim(),
        fileName: path.basename(absolutePath),
        originalPath: absolutePath,
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString(),
        isUploaded: false
      };
    }

    // Update sources list
    const updatedSources = [...existingSources, newSource];
    saveSources(updatedSources);

    return NextResponse.json({ source: newSource, message: 'Source created successfully' });
  } catch (error) {
    console.error('Error creating source:', error);
    return NextResponse.json({ message: 'Failed to create source' }, { status: 500 });
  }
} 