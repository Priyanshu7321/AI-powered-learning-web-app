#!/bin/bash

# Create directories
mkdir -p public/models/wav2vec2-base-960h

# Base URL for the model files
BASE_URL="https://huggingface.co/Xenova/wav2vec2-base-960h/resolve/main"

# Files to download
FILES=(
    "config.json"
    "model.onnx"
    "tokenizer.json"
    "tokenizer_config.json"
    "vocab.json"
    "preprocessor_config.json"
)

# Download each file
for file in "${FILES[@]}"; do
    echo "Downloading $file..."
    curl -L "$BASE_URL/$file" -o "public/models/wav2vec2-base-960h/$file"
done

echo "Model files downloaded successfully!"