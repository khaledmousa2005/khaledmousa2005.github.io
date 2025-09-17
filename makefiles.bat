@echo off
for /l %%i in (1,1,30) do (
  echo /* CSS for product%%i */ > style%%i.css
  echo body {font-family: Arial, sans-serif;} >> style%%i.css
  echo .product-page {max-width:1200px; margin:20px auto; background:#fff; padding:20px; border-radius:10px;} >> style%%i.css
  echo .price {color:#00aaff; font-weight:bold;} >> style%%i.css
)
echo Done! Created 30 CSS files.
pausepause