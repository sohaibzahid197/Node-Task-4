const http = require('http');
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');

let users;

try {
    const data = fs.readFileSync('users.json', 'utf8');
    users = JSON.parse(data);
} catch (error) {
    console.error('Error reading users.json:', error);
    users = [];
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    const parsedQs = querystring.parse(parsedUrl.query);
    const headers = req.headers;

    switch(parsedUrl.pathname) {
        case '/processdata':
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(parsedQs));
            break;
            case '/customheaders':
                res.writeHead(200, {
                    'Content-Type': 'text/plain',
                    'Content-Length': '123',
                    'Custom-Header': 'Custom Value'
                });
                res.end('Custom headers sent!');
                break;
            
        case '/printheaders':
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(headers));
            break;
        case '/printmethod':
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(req.method);
            break;
        case '/userdata':
            res.writeHead(200, {'Content-Type': 'application/json'});
            const user = users.find(user => user.id == parsedQs.user_id);
            if (user) {
                res.end(JSON.stringify(user));
            } else {
                res.end(JSON.stringify({error: "User not found"}));
            }
            break;
        case '/headersintable':
            let table = '<table><tr><th>Header</th><th>Value</th></tr>';
            for (let header in headers) {
                table += `<tr><td>${header}</td><td>${headers[header]}</td></tr>`;
            }
            table += '</table>';
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(table);
            break;
        default:
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Invalid endpoint');
    }
});

server.listen(8001, () => {
    console.log('Server listening on http://localhost:8001');
});
