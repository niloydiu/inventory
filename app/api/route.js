// Next.js App Router API handler for Express app
const express = require('express');
const app = require('../../server/app');

// Convert Express app to Next.js API handler
export async function GET(request) {
  return handleRequest(request);
}

export async function POST(request) {
  return handleRequest(request);
}

export async function PUT(request) {
  return handleRequest(request);
}

export async function PATCH(request) {
  return handleRequest(request);
}

export async function DELETE(request) {
  return handleRequest(request);
}

async function handleRequest(request) {
  return new Promise((resolve) => {
    const { pathname, searchParams } = new URL(request.url);
    
    // Create mock req/res objects for Express
    const req = {
      method: request.method,
      url: pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''),
      headers: Object.fromEntries(request.headers.entries()),
      body: null,
    };
    
    // Parse body for POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      request.json().then(body => {
        req.body = body;
        processRequest(req, resolve);
      }).catch(() => {
        processRequest(req, resolve);
      });
    } else {
      processRequest(req, resolve);
    }
  });
}

function processRequest(req, resolve) {
  const chunks = [];
  const res = {
    statusCode: 200,
    headers: {},
    setHeader(key, value) {
      this.headers[key.toLowerCase()] = value;
    },
    getHeader(key) {
      return this.headers[key.toLowerCase()];
    },
    writeHead(statusCode, headers) {
      this.statusCode = statusCode;
      if (headers) {
        Object.keys(headers).forEach(key => {
          this.setHeader(key, headers[key]);
        });
      }
    },
    write(chunk) {
      chunks.push(chunk);
    },
    end(chunk) {
      if (chunk) chunks.push(chunk);
      const body = Buffer.concat(chunks.map(c => typeof c === 'string' ? Buffer.from(c) : c)).toString();
      
      resolve(new Response(body, {
        status: this.statusCode,
        headers: this.headers,
      }));
    },
  };
  
  app(req, res);
}
