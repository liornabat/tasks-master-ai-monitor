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

// Save sources to file
function saveSources(sources: Source[]): void {
  if (!fs.existsSync(SOURCES_DIR)) {
    fs.mkdirSync(SOURCES_DIR, { recursive: true });
  }
  
  try {
    fs.writeFileSync(SOURCES_FILE, JSON.stringify(sources, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving sources:', error);
    throw error;
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sourceId } = await params;
    const sources = loadSources();
    
    const sourceIndex = sources.findIndex(s => s.id === sourceId);
    if (sourceIndex === -1) {
      return NextResponse.json({ message: 'Source not found' }, { status: 404 });
    }
    
    const sourceToDelete = sources[sourceIndex];
    
    // Delete the local backup file if it exists (don't delete original files)
    if (sourceToDelete.filePath && sourceToDelete.isUploaded) {
      const fullFilePath = path.join(FILES_DIR, sourceToDelete.filePath);
      if (fs.existsSync(fullFilePath)) {
        fs.unlinkSync(fullFilePath);
      }
    }
    
    // Remove from sources list
    sources.splice(sourceIndex, 1);
    saveSources(sources);
    
    return NextResponse.json({ message: 'Source deleted successfully' });
  } catch (error) {
    console.error('Error deleting source:', error);
    return NextResponse.json({ message: 'Failed to delete source' }, { status: 500 });
  }
} 