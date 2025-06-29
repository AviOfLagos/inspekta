'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

interface OpenAPISpec {
  openapi: string;
  info: object;
  servers: object[];
  paths: object;
  components: object;
}

export default function ApiDocsPage() {
  const [spec, setSpec] = useState<OpenAPISpec | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiSpec = async () => {
      try {
        const response = await fetch('/api/docs');
        if (!response.ok) {
          throw new Error('Failed to fetch API specification');
        }
        const apiSpec = await response.json();
        setSpec(apiSpec);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load API documentation');
      } finally {
        setLoading(false);
      }
    };

    fetchApiSpec();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading API Documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Documentation</h2>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">🏠 Inspekta Platform API</h1>
              <p className="text-blue-100">
                Interactive API documentation for the real estate marketplace and inspection platform
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">Version 1.0.0</div>
              <div className="text-xs text-blue-200">OpenAPI 3.0</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="container mx-auto px-4">
          <div className="flex space-x-6 text-sm">
            <a 
              href="/docs" 
              className="text-blue-600 font-medium"
            >
              📖 Interactive Docs
            </a>
            <a 
              href="/api/docs" 
              target="_blank"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              📄 OpenAPI JSON
            </a>
            <Link 
              href="/" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              🏠 Back to Platform
            </Link>
            <a 
              href="https://github.com/avioflagos/inspekta" 
              target="_blank"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              📂 GitHub Repository
            </a>
          </div>
        </div>
      </div>

      {/* Swagger UI */}
      {spec && (
        <div className="swagger-container">
          <SwaggerUI 
            spec={spec} 
            docExpansion="none"
            defaultModelsExpandDepth={2}
            defaultModelExpandDepth={2}
            tryItOutEnabled={true}
            requestInterceptor={(request) => {
              // Add any custom headers or modifications to requests
              request.headers['Content-Type'] = 'application/json';
              return request;
            }}
            responseInterceptor={(response) => {
              // Handle responses if needed
              return response;
            }}
            onComplete={() => {
              console.log('Swagger UI loaded successfully');
            }}
            supportedSubmitMethods={['get', 'post', 'put', 'delete', 'patch']}
            deepLinking={true}
          />
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>
            Built with ❤️ using Next.js, TypeScript, and OpenAPI 3.0 | 
            <a href="avioflagos@gmail.com" className="text-blue-600 hover:underline ml-1">
              Contact Support
            </a>
          </p>
          <div className="mt-2 space-x-4">
            <span>🔐 Secure Authentication</span>
            <span>📧 Email Integration</span>
            <span>🏢 Multi-tenant Ready</span>
            <span>🇳🇬 Nigeria Focused</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .swagger-container {
          max-width: 100%;
          margin: 0;
        }
        
        .swagger-ui .topbar {
          display: none;
        }
        
        .swagger-ui .info {
          margin: 20px 0;
        }
        
        .swagger-ui .scheme-container {
          background: #f8f9fa;
          padding: 10px;
          border-radius: 4px;
          margin: 20px 0;
        }
        
        .swagger-ui .btn.authorize {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }
        
        .swagger-ui .btn.authorize:hover {
          background-color: #2563eb;
          border-color: #2563eb;
        }
        
        .swagger-ui .opblock.opblock-post {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }
        
        .swagger-ui .opblock.opblock-post .opblock-summary-method {
          background: #10b981;
        }
        
        .swagger-ui .opblock.opblock-get {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
        }
        
        .swagger-ui .opblock.opblock-get .opblock-summary-method {
          background: #3b82f6;
        }
        
        .swagger-ui .opblock.opblock-put {
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.1);
        }
        
        .swagger-ui .opblock.opblock-put .opblock-summary-method {
          background: #f59e0b;
        }
        
        .swagger-ui .opblock.opblock-delete {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }
        
        .swagger-ui .opblock.opblock-delete .opblock-summary-method {
          background: #ef4444;
        }
      `}</style>
    </div>
  );
}