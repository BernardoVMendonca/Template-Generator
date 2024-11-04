# Código feito para que o JS tenha a permissão de rodar no navegador e acesse outros arquivos locais (não todos pq a sandbox do navegador não vai deixar)

import http.server
import socketserver
import webbrowser
import os

PORT = 8000
DIRECTORY = "./"

os.chdir(DIRECTORY)

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Servidor HTTP iniciado na porta {PORT}")
    
    webbrowser.open(f'http://localhost:{PORT}/collection_creator.html')
    
    httpd.serve_forever()