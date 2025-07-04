import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Validate that it's a JSON file
    if (!file.name.endsWith('.json')) {
      return NextResponse.json({ message: 'File must be a JSON file' }, { status: 400 });
    }

    // Read the file content
    const fileContent = await file.text();
    
    try {
      // Validate JSON
      JSON.parse(fileContent);
    } catch {
      return NextResponse.json({ message: 'Invalid JSON file' }, { status: 400 });
    }
    
    // Save with standard name
    const finalPath = path.join(uploadsDir, 'tasks.json');
    fs.writeFileSync(finalPath, fileContent, 'utf8');
    
    return NextResponse.json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
} 