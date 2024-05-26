import os
import json

def read_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except UnicodeDecodeError:
        return None  # Skip binary files or files that cannot be decoded

def dir_to_json(directory, ignore_list):
    result = {}
    for root, dirs, files in os.walk(directory):
        relative_path = os.path.relpath(root, directory)

        # Check if the current directory should be ignored
        if any(os.path.commonpath([os.path.join(directory, ignore)]) == os.path.commonpath([os.path.join(directory, relative_path)]) for ignore in ignore_list):
            dirs[:] = []  # Don't descend into this directory
            continue

        if relative_path == ".":
            relative_path = ""
        sub_result = result
        if relative_path:
            for part in relative_path.split(os.sep):
                sub_result = sub_result.setdefault(part, {})

        for file in files:
            file_relative_path = os.path.join(relative_path, file)
            # Check if the file should be ignored
            if any(os.path.commonpath([os.path.join(directory, ignore)]) == os.path.commonpath([os.path.join(directory, file_relative_path)]) for ignore in ignore_list):
                continue
            file_path = os.path.join(root, file)
            file_content = read_file(file_path)
            if file_content is not None:
                sub_result[file] = file_content
    return result

def main():
    directory = r'.'
    ignore_list = [
        'server/node_modules',
        'server/package-lock.json',
        'server/swagger_output.json'
    ]

    # Normalize ignore list to include full paths relative to the directory
    ignore_list = [os.path.normpath(ignore) for ignore in ignore_list]

    json_data = dir_to_json(directory, ignore_list)
    json_output = os.path.join(directory, 'output.json')

    with open(json_output, 'w', encoding='utf-8') as json_file:
        json.dump(json_data, json_file, ensure_ascii=False, indent=4)

    print(f"JSON data has been written to {json_output}")

if __name__ == "__main__":
    main()
