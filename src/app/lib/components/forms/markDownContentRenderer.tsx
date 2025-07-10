import React from 'react';
import { Box, useTheme } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; 

interface MarkdownContentRendererProps {
    content: string;
}

const MarkdownContentRenderer: React.FC<MarkdownContentRendererProps> = ({ content }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                
                '& h1, & h2, & h3, & h4, & h5, & h6': {
                    marginTop: '1.5em',
                    marginBottom: '0.75em',
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                },
                '& h1': {
                    fontSize: '1.75rem',
                    borderBottom: `2px solid ${theme.palette.grey[200]}`,
                    paddingBottom: '0.5rem'
                },
                '& h2': {
                    fontSize: '1.5rem',
                    borderBottom: `1px solid ${theme.palette.grey[200]}`,
                    paddingBottom: '0.25rem'
                },
                '& h3': { fontSize: '1.25rem' },
                '& h4': { fontSize: '1.1rem' },
                '& h5': { fontSize: '1rem' },
                '& h6': { fontSize: '0.9rem' },

                '& p': {
                    marginBottom: '1em',
                    lineHeight: 1.7,
                    textAlign: 'justify',
                    color: theme.palette.text.primary,
                },

                '& ul, & ol': {
                    marginBottom: '1em',
                    paddingLeft: '1.5em',
                },

                '& li': {
                    marginBottom: '0.5em',
                    lineHeight: 1.6,
                },

                '& ul li': {
                    listStyleType: 'disc',
                },

                '& ol li': {
                    listStyleType: 'decimal',
                },

                '& strong': {
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                },

                '& em': {
                    fontStyle: 'italic',
                    color: theme.palette.text.secondary,
                },

                '& code': {
                    backgroundColor: theme.palette.grey[100],
                    color: theme.palette.error.main,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.9em',
                    fontFamily: '"Courier New", Courier, monospace',
                    border: `1px solid ${theme.palette.grey[300]}`,
                },

                '& pre': {
                    backgroundColor: theme.palette.grey[50],
                    border: `1px solid ${theme.palette.grey[300]}`,
                    borderRadius: '8px',
                    padding: '1rem',
                    overflow: 'auto',
                    marginBottom: '1em',
                },

                '& pre code': {
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: 0,
                    color: theme.palette.text.primary,
                },

                '& blockquote': {
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    backgroundColor: theme.palette.grey[50],
                    margin: '1em 0',
                    padding: '0.5em 1em',
                    fontStyle: 'italic',
                    color: theme.palette.text.secondary,
                },

                '& table': {
                    width: '100%',
                    borderCollapse: 'collapse',
                    marginBottom: '1em',
                    border: `1px solid ${theme.palette.grey[300]}`,
                },

                '& th, & td': {
                    border: `1px solid ${theme.palette.grey[300]}`,
                    padding: '8px 12px',
                    textAlign: 'left',
                },

                '& th': {
                    backgroundColor: theme.palette.grey[100],
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                },

                '& tr:nth-of-type(even)': {
                    backgroundColor: theme.palette.grey[50],
                },

                '& hr': {
                    border: 'none',
                    borderTop: `2px solid ${theme.palette.grey[300]}`,
                    margin: '2em 0',
                },

                '& a': {
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    '&:hover': {
                        textDecoration: 'underline',
                    },
                },

                
                '& > *:first-of-type': {
                    marginTop: 0,
                },
                '& > *:last-child': {
                    marginBottom: 0,
                },
            }}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
            >
                {content}
            </ReactMarkdown>
        </Box>
    );
};

export default MarkdownContentRenderer;