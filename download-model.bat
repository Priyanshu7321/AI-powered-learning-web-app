@echo off
echo Creating directories...
mkdir "public\models\wav2vec2-base-960h" 2>nul

echo Downloading model files...

:: Base URL for the model files
set BASE_URL=https://huggingface.co/Xenova/wav2vec2-base-960h/resolve/main

:: Download each file using PowerShell
powershell -Command "& {
    $files = @(
        'config.json',
        'model.onnx',
        'tokenizer.json',
        'tokenizer_config.json',
        'vocab.json',
        'preprocessor_config.json'
    )
    
    foreach ($file in $files) {
        Write-Host 'Downloading ' $file '...'
        $url = '%BASE_URL%/' + $file
        $output = 'public\models\wav2vec2-base-960h\' + $file
        Invoke-WebRequest -Uri $url -OutFile $output -UseBasicParsing
    }
}"

echo Model files downloaded successfully!
pause 