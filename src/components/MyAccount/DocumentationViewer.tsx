import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Paper,
  Chip,

  Card,
  CardContent,
  CardHeader,
  IconButton,
  Collapse,
  Alert,
  CircularProgress
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import {
  Description as DescriptionIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  BugReport as BugReportIcon,
  Settings as SettingsIcon,
  School as SchoolIcon,
  OpenInNew as OpenInNewIcon,
  Article as ArticleIcon,
  Dashboard as DashboardIcon,
  LocalOffer as LocalOfferIcon
} from '@mui/icons-material';
import { Colors } from '../constants';

interface DocumentInfo {
  name: string;
  path: string;
  category: string;
  description: string;
  size?: string;
  lastModified?: string;
  icon: React.ReactNode;
  color: string;
}

export default function DocumentationViewer() {
  const [selectedDoc, setSelectedDoc] = useState<DocumentInfo | null>(null);
  const [docContent, setDocContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    analytics: true,
    core: true,
    admin: false,
    fraud: false
  });

  // Documentation catalog
  const documentationCatalog: DocumentInfo[] = [
    {
      name: 'Reservation Statuses',
      path: '/docs/RESERVATION_STATUSES.md',
      category: 'core',
      description: 'Industry standard reservation statuses for booking systems (hotels, vacation rentals, etc.)',
      icon: <DescriptionIcon />,
      color: '#2e7d32'
    },
    {
      name: 'Analytics Documentation',
      path: '/ANALYTICS_DOCUMENTATION.md',
      category: 'analytics',
      description: 'Comprehensive guide to the property analytics system including API reference, usage guides, and troubleshooting',
      icon: <AnalyticsIcon />,
      color: '#1976d2'
    },
    {
      name: 'Analytics Quick Reference',
      path: '/ANALYTICS_QUICK_REFERENCE.md',
      category: 'analytics',
      description: 'Developer quick start guide with code examples and implementation patterns',
      icon: <ArticleIcon />,
      color: '#1976d2'
    },
    {
      name: 'README',
      path: '/README.md',
      category: 'core',
      description: 'Main project documentation with setup instructions and feature overview',
      icon: <DescriptionIcon />,
      color: '#2e7d32'
    },
    {
      name: 'Migration Guide',
      path: '/MIGRATION_GUIDE.md',
      category: 'core',
      description: 'Guide for migrating between different versions of the platform',
      icon: <SettingsIcon />,
      color: '#2e7d32'
    },
    {
      name: 'Firebase Claims Guide',
      path: '/FIREBASE_CLAIMS_GUIDE.md',
      category: 'admin',
      description: 'Authentication and authorization setup using Firebase custom claims',
      icon: <SecurityIcon />,
      color: '#f57c00'
    },
    {
      name: 'Claims & Permissions Documentation',
      path: '/docs/CLAIMS_PERMISSIONS_DOCUMENTATION.md',
      category: 'admin',
      description: 'Detailed documentation on user roles, permissions, and access control implementation',
      icon: <SecurityIcon />,
      color: '#f57c00'
    },
    {
      name: 'Firebase Indexing Setup',
      path: '/FIREBASE_INDEXING_SETUP.md',
      category: 'admin',
      description: 'Database indexing configuration for optimal performance',
      icon: <SettingsIcon />,
      color: '#f57c00'
    },
    {
      name: 'New Employee Wizard',
      path: '/NEW_EMPLOYEE_WIZARD_README.md',
      category: 'admin',
      description: 'Guide for onboarding new team members with the employee setup wizard',
      icon: <SchoolIcon />,
      color: '#f57c00'
    },
    {
      name: 'CEO Analytics Documentation',
      path: '/docs/CEOAnalytics.md',
      category: 'admin',
      description: 'Executive-level analytics dashboard providing strategic insights for CEO decision-making',
      icon: <DashboardIcon />,
      color: '#f57c00'
    },
    {
      name: 'Promotional Pricing System',
      path: '/docs/PROMOTIONAL_PRICING_DOCUMENTATION.md',
      category: 'admin',
      description: 'Comprehensive system for dynamic room pricing, discounts, and promotional offers with flexible conditions',
      icon: <LocalOfferIcon />,
      color: '#f57c00'
    },
    {
      name: 'Fraud Detection Overview',
      path: '/docs/fraud-detection/README.md',
      category: 'fraud',
      description: 'Overview of the fraud detection system and its capabilities',
      icon: <BugReportIcon />,
      color: '#d32f2f'
    },
    {
      name: 'Fraud Detection Implementation',
      path: '/docs/fraud-detection/IMPLEMENTATION.md',
      category: 'fraud',
      description: 'Technical implementation details of the fraud detection system',
      icon: <BugReportIcon />,
      color: '#d32f2f'
    },
    {
      name: 'Fraud Detection API',
      path: '/docs/fraud-detection/API.md',
      category: 'fraud',
      description: 'API documentation for fraud detection endpoints and integration',
      icon: <BugReportIcon />,
      color: '#d32f2f'
    },
    {
      name: 'Fraud Detection Testing',
      path: '/docs/fraud-detection/TESTING.md',
      category: 'fraud',
      description: 'Testing procedures and test data generation for fraud detection',
      icon: <BugReportIcon />,
      color: '#d32f2f'
    },
    {
      name: 'Fraud Test Data Guide',
      path: '/FRAUD_TEST_DATA_README.md',
      category: 'fraud',
      description: 'Instructions for generating and managing fraud detection test data',
      icon: <BugReportIcon />,
      color: '#d32f2f'
    },
    {
      name: 'Changelog',
      path: '/CHANGELOG.md',
      category: 'core',
      description: 'Version history and release notes for the platform',
      icon: <DescriptionIcon />,
      color: '#2e7d32'
    }
  ];

  const categoryLabels: { [key: string]: { name: string; color: string } } = {
    analytics: { name: 'Analytics & Metrics', color: '#1976d2' },
    core: { name: 'Core Platform', color: '#2e7d32' },
    admin: { name: 'Administration', color: '#f57c00' },
    fraud: { name: 'Fraud Detection', color: '#d32f2f' }
  };

  const handleCategoryToggle = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const loadDocumentContent = async (doc: DocumentInfo) => {
    setLoading(true);
    setSelectedDoc(doc);
    
    try {
      // Try to fetch the file from the public directory
      const response = await fetch(doc.path);
      
      if (response.ok) {
        const content = await response.text();
        setDocContent(content);
      } else {
        // If file not found, show a helpful error message
        const errorContent = `# ${doc.name}

⚠️ **Document not found**

**File Path:** \`${doc.path}\`
**Category:** ${categoryLabels[doc.category]?.name}
**Description:** ${doc.description}

## File Access Information

This documentation file exists in the project repository but may not be accessible via the web server.

### For Development:
- The file should be located at: \`${doc.path}\`
- Ensure the development server is serving static files from the public directory
- Check that the file was copied to the public folder during build

### File Content Preview:
The file contains documentation for: ${doc.description}

### Manual Access:
You can access this file directly in the project repository or file system.

---
**Status**: ${response.status} ${response.statusText}`;
        
        setDocContent(errorContent);
      }
    } catch (error) {
      console.error('Error loading document:', error);
      const errorContent = `# Error Loading ${doc.name}

**Document Path:** \`${doc.path}\`
**Error:** ${error instanceof Error ? error.message : 'Unknown error occurred'}

## Troubleshooting Steps

1. **Check File Location**: Ensure the file exists in the public folder
2. **Verify Server**: Make sure the development server is running
3. **Check Network**: Verify there are no network connectivity issues
4. **File Permissions**: Ensure the file has proper read permissions

## Alternative Access

You can access this documentation file directly in the project repository at:
\`${doc.path.replace('/public/', '/')}\`

The file contains: ${doc.description}`;
      
      setDocContent(errorContent);
    } finally {
      setLoading(false);
    }
  };

  const renderDocumentList = () => {
    const groupedDocs = documentationCatalog.reduce((acc, doc) => {
      if (!acc[doc.category]) {
        acc[doc.category] = [];
      }
      acc[doc.category].push(doc);
      return acc;
    }, {} as { [key: string]: DocumentInfo[] });

    return Object.entries(groupedDocs).map(([category, docs]) => (
      <Box key={category} sx={{ mb: 2 }}>
        <ListItemButton
          onClick={() => handleCategoryToggle(category)}
          sx={{
            borderRadius: 1,
            mb: 1,
            backgroundColor: expandedCategories[category] ? `${categoryLabels[category]?.color}10` : 'transparent'
          }}
        >
          <ListItemIcon>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: categoryLabels[category]?.color || '#666'
              }}
            />
          </ListItemIcon>
          <ListItemText
            primary={categoryLabels[category]?.name}
            primaryTypographyProps={{
              fontWeight: 600,
              color: categoryLabels[category]?.color
            }}
          />
          {expandedCategories[category] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>
        
        <Collapse in={expandedCategories[category]}>
          <List sx={{ pl: 2 }}>
            {docs.map((doc) => (
              <ListItemButton
                key={doc.path}
                onClick={() => loadDocumentContent(doc)}
                selected={selectedDoc?.path === doc.path}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: `${doc.color}15`,
                    '&:hover': {
                      backgroundColor: `${doc.color}20`
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {React.cloneElement(doc.icon as React.ReactElement, {
                    sx: { fontSize: 20, color: doc.color }
                  })}
                </ListItemIcon>
                <ListItemText
                  primary={doc.name}
                  secondary={doc.description}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: selectedDoc?.path === doc.path ? 600 : 400
                  }}
                  secondaryTypographyProps={{
                    fontSize: '0.8rem'
                  }}
                />
                <IconButton size="small" sx={{ opacity: 0.7 }}>
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </Box>
    ));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom color={Colors.blue} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <DescriptionIcon />
        Developer Documentation
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Access all technical documentation, guides, and references for the Kottage platform.
      </Typography>

      <Grid container spacing={3}>
        {/* Document List Sidebar */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, maxHeight: 600, overflow: 'auto' }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Documentation Library
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Alert severity="info" sx={{ mb: 2 }}>
              {documentationCatalog.length} documents available across {Object.keys(categoryLabels).length} categories
            </Alert>

            <List>
              {renderDocumentList()}
            </List>
          </Paper>
        </Grid>

        {/* Document Content Viewer */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, minHeight: 600 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                <CircularProgress />
              </Box>
            ) : selectedDoc ? (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {React.cloneElement(selectedDoc.icon as React.ReactElement, {
                    sx: { fontSize: 24, color: selectedDoc.color, mr: 1 }
                  })}
                  <Typography variant="h6" color={selectedDoc.color}>
                    {selectedDoc.name}
                  </Typography>
                  <Chip
                    label={categoryLabels[selectedDoc.category]?.name}
                    size="small"
                    sx={{
                      ml: 2,
                      backgroundColor: `${selectedDoc.color}15`,
                      color: selectedDoc.color
                    }}
                  />
                </Box>
                
                <Box 
                  sx={{
                    '& h1, & h2, & h3, & h4, & h5, & h6': {
                      color: selectedDoc.color,
                      mt: 3,
                      mb: 2
                    },
                    '& h1': { fontSize: '2rem', fontWeight: 600 },
                    '& h2': { fontSize: '1.5rem', fontWeight: 600 },
                    '& h3': { fontSize: '1.25rem', fontWeight: 600 },
                    '& p': { mb: 2, lineHeight: 1.6 },
                    '& code': {
                      backgroundColor: '#f5f5f5',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '0.9rem',
                      fontFamily: 'monospace'
                    },
                    '& pre': {
                      backgroundColor: '#f8f9fa',
                      padding: 2,
                      borderRadius: 1,
                      overflow: 'auto',
                      border: '1px solid #e1e4e8'
                    },
                    '& blockquote': {
                      borderLeft: `4px solid ${selectedDoc.color}`,
                      paddingLeft: 2,
                      marginLeft: 0,
                      fontStyle: 'italic',
                      backgroundColor: `${selectedDoc.color}08`
                    },
                    '& ul, & ol': { pl: 3, mb: 2 },
                    '& li': { mb: 0.5 },
                    '& table': {
                      width: '100%',
                      borderCollapse: 'collapse',
                      mb: 2
                    },
                    '& th, & td': {
                      border: '1px solid #ddd',
                      padding: 1,
                      textAlign: 'left'
                    },
                    '& th': {
                      backgroundColor: '#f2f2f2',
                      fontWeight: 600
                    }
                  }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                  >
                    {docContent}
                  </ReactMarkdown>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <DescriptionIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Select a Document
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  Choose a document from the sidebar to view its content here.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Alert severity="info">
          <Typography variant="body2">
            <strong>Documentation Viewer:</strong> This system loads and displays markdown documentation files
            with full formatting, syntax highlighting, and GitHub-flavored markdown support.
            Files are served from the public directory for easy access and updating.
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
};

