import zipfile
import xml.etree.ElementTree as ET
import sys
import os

def get_docx_text(path):
    try:
        with zipfile.ZipFile(path) as document:
            xml_content = document.read('word/document.xml')
        
        tree = ET.fromstring(xml_content)
        
        text = []
        for elem in tree.iter():
            if elem.tag.endswith('t'):
                if elem.text:
                    text.append(elem.text)
            elif elem.tag.endswith('p'):
                text.append('\n')
                
        return ''.join(text)
    except Exception as e:
        return str(e)

file_path = r'c:\Users\the_8\IngSw-seccion1\Retroalimentación Sistema (2).docx'
if os.path.exists(file_path):
    print(get_docx_text(file_path))
else:
    print(f"File not found: {file_path}")
