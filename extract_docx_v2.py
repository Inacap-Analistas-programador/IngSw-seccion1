import zipfile
import xml.etree.ElementTree as ET
import sys
import os
import shutil

def extract_docx_content(docx_path, output_dir):
    if not os.path.exists(docx_path):
        print(f"File not found: {docx_path}")
        return

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    try:
        with zipfile.ZipFile(docx_path) as document:
            # Extract Text
            xml_content = document.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            
            text = []
            for elem in tree.iter():
                if elem.tag.endswith('t'):
                    if elem.text:
                        text.append(elem.text)
                elif elem.tag.endswith('p'):
                    text.append('\n')
            
            text_content = ''.join(text)
            output_text_path = os.path.join(output_dir, 'extracted_feedback.txt')
            with open(output_text_path, 'w', encoding='utf-8') as f:
                f.write(text_content)
            print(f"Text content saved to: {output_text_path}")
            print("--- TEXT CONTENT PREVIEW ---")
            print(text_content[:500])
            print("--------------------")

            # Extract Images
            media_files = [f for f in document.namelist() if f.startswith('word/media/')]
            if media_files:
                print(f"\nFound {len(media_files)} images:")
                for media_file in media_files:
                    filename = os.path.basename(media_file)
                    target_path = os.path.join(output_dir, filename)
                    with document.open(media_file) as source, open(target_path, "wb") as target:
                        shutil.copyfileobj(source, target)
                    print(f"- Extracted: {target_path}")
            else:
                print("\nNo images found in document.")

    except Exception as e:
        print(f"Error: {str(e)}")

docx_path = r'c:\Users\the_8\IngSw-seccion1\Retroalimentación Sistema (2).docx'
output_dir = r'c:\Users\the_8\.gemini\antigravity\brain\8c71b5ec-c18a-461f-9702-27f4472664ef\extracted_media'

extract_docx_content(docx_path, output_dir)
