@echo off
setlocal enabledelayedexpansion

REM Directory containing the original images
set "inputDir=C:\Users\Abnosia\Desktop\Undigging\IMG\Midas"
REM Directory to save the thumbnails
set "outputDir=C:\Users\Abnosia\Desktop\Undigging\IMG\Midas\Thumbnails"
REM Thumbnail dimensions
set "width=300"
set "height=250"    

REM Create the output directory if it doesn't exist
if not exist "%outputDir%" mkdir "%outputDir%"

REM Initialize a counter for numbering the thumbnails
set counter=1

REM Loop through each .jpg file in the input directory
for %%f in ("%inputDir%\*.jpeg") do (
    REM Define the output path for the thumbnail
    set "outputPath=%outputDir%\!counter!-thumb.jpg"

    REM Resize the image and save it to the output path
    magick "%%f" -resize %width%x%height% "!outputPath!"

    REM Increment the counter
    set /a counter+=1
)

endlocal