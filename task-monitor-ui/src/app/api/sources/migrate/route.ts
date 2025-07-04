import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Source } from '@/types';

const SOURCES_DIR = path.join(process.cwd(), 'sources');
const SOURCES_FILE = path.join(SOURCES_DIR, 'sources.json');
const FILES_DIR = path.join(SOURCES_DIR, 'files');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const OLD_TASKS_FILE = path.join(UPLOADS_DIR, 'tasks.json');

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
  if (!fs.existsSync(SOURCES_FILE)) {
    return [];
  }
  
  try {
    const data = fs.readFileSync(SOURCES_FILE, 'utf8');
    return JSON.parse(data);
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

export async function POST() {
  try {
    // Check if migration is needed
    if (!fs.existsSync(OLD_TASKS_FILE)) {
      return NextResponse.json({ 
        message: 'No migration needed - no existing tasks.json found',
        migrated: false
      });
    }

    // Check if sources already exist
    const existingSources = loadSources();
    if (existingSources.length > 0) {
      return NextResponse.json({ 
        message: 'Migration not needed - sources already exist',
        migrated: false
      });
    }

    // Read the old file
    const taskContent = fs.readFileSync(OLD_TASKS_FILE, 'utf8');
    
    // Validate JSON
    try {
      JSON.parse(taskContent);
    } catch {
      return NextResponse.json({ 
        message: 'Invalid JSON in existing tasks.json',
        migrated: false
      }, { status: 400 });
    }

    // Create the migration source
    const sourceId = uuidv4();
    const fileName = `${sourceId}.json`;
    const fullFilePath = path.join(FILES_DIR, fileName);
    
    const migrationSource: Source = {
      id: sourceId,
      name: 'Migrated Tasks',
      fileName: 'tasks.json',
      filePath: fileName,
      originalPath: fullFilePath, // For migrated files, use local copy as original
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      isUploaded: true
    };

    // Save the file to sources directory
    ensureDirectories();
    fs.writeFileSync(fullFilePath, taskContent, 'utf8');

    // Save the source
    saveSources([migrationSource]);

    // Optionally remove the old file (commented out for safety)
    // fs.unlinkSync(OLD_TASKS_FILE);

    return NextResponse.json({ 
      message: 'Successfully migrated existing tasks.json to sources',
      migrated: true,
      source: migrationSource
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ 
      message: 'Failed to migrate existing tasks',
      migrated: false
    }, { status: 500 });
  }
} 