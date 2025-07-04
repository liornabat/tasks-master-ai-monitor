import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Source } from '@/types';

const SOURCES_DIR = path.join(process.cwd(), 'sources');
const SOURCES_FILE = path.join(SOURCES_DIR, 'sources.json');
const FILES_DIR = path.join(SOURCES_DIR, 'files');

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

// Save sources to file (for updating lastUsed)
function saveSources(sources: Source[]): void {
  if (!fs.existsSync(SOURCES_DIR)) {
    fs.mkdirSync(SOURCES_DIR, { recursive: true });
  }
  
  try {
    fs.writeFileSync(SOURCES_FILE, JSON.stringify(sources, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving sources:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sourceId = searchParams.get('source');
    
    if (!sourceId) {
      return NextResponse.json({ message: 'Source ID is required' }, { status: 400 });
    }
    
    // Find the source
    const sources = loadSources();
    const source = sources.find(s => s.id === sourceId);
    
    if (!source) {
      return NextResponse.json({ message: 'Source not found' }, { status: 404 });
    }
    
    // Try to read from original path first, fallback to local copy
    let content: string;
    
          if (fs.existsSync(source.originalPath)) {
        try {
          fs.accessSync(source.originalPath, fs.constants.R_OK);
          content = fs.readFileSync(source.originalPath, 'utf8');
      } catch {
        // If original path fails and we have a backup, use it
        if (source.filePath) {
          const backupPath = path.join(FILES_DIR, source.filePath);
          if (fs.existsSync(backupPath)) {
            content = fs.readFileSync(backupPath, 'utf8');
          } else {
            return NextResponse.json({ message: 'Source file not accessible and no backup available' }, { status: 404 });
          }
        } else {
          return NextResponse.json({ message: 'Source file not accessible' }, { status: 404 });
        }
      }
    } else {
      // Original file doesn't exist, try backup
      if (source.filePath) {
        const backupPath = path.join(FILES_DIR, source.filePath);
        if (fs.existsSync(backupPath)) {
          content = fs.readFileSync(backupPath, 'utf8');
        } else {
          return NextResponse.json({ message: 'Source file not found' }, { status: 404 });
        }
      } else {
        return NextResponse.json({ message: 'Source file not found' }, { status: 404 });
      }
    }
    
    // Update lastUsed
    source.lastUsed = new Date().toISOString();
    saveSources(sources);
    const taskData = JSON.parse(content);
    
    // Return the data in the expected format along with source info
    return NextResponse.json({ 
      tags: taskData,
      source: source
    });
  } catch (error) {
    console.error('Error reading tasks file:', error);
    return NextResponse.json({ message: 'Error reading tasks file' }, { status: 500 });
  }
} 