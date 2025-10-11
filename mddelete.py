import os

for file in os.listdir('.'):
    if file.endswith('.md'):
        os.remove(file)
        print(f"Deleted: {file}")