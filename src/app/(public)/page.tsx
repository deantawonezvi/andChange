'use client';

import React from 'react';
import {Box, Button, Container, Paper, Typography, useTheme} from '@mui/material';
import {motion} from 'framer-motion';
import Link from 'next/link';
import {ArrowRight, LogIn, UserPlus} from 'lucide-react';

const LandingPage = () => {
  const theme = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
      <Container maxWidth="lg">
        <Box
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 4,
              py: 8,
              textAlign: 'center'
            }}
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants}>
            <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  fontWeight: 700,
                  mb: 2,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}
            >
              andChange Dashboard
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  color: 'text.secondary',
                  maxWidth: '800px',
                  mb: 6
                }}
            >
              Your complete platform for managing organizational change and transformation
            </Typography>
          </motion.div>

          {/* CTA Buttons */}
          <Box
              component={motion.div}
              variants={itemVariants}
              sx={{
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' }
              }}
          >
            <Link href="/login" passHref style={{ textDecoration: 'none' }}>
              <Button
                  variant="contained"
                  size="large"
                  startIcon={<LogIn />}
                  endIcon={<ArrowRight />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: 1,
                    textTransform: 'none'
                  }}
              >
                Sign In
              </Button>
            </Link>

            <Link href="/register" passHref style={{ textDecoration: 'none' }}>
              <Button
                  variant="outlined"
                  size="large"
                  startIcon={<UserPlus />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: 1,
                    textTransform: 'none'
                  }}
              >
                Create Account
              </Button>
            </Link>
          </Box>

          {/* Feature Cards */}
          <Box
              component={motion.div}
              variants={itemVariants}
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(3, 1fr)'
                },
                gap: 3,
                width: '100%',
                mt: 8
              }}
          >
            {[
              {
                title: 'Project Management',
                description: 'Track and manage change initiatives across your organization'
              },
              {
                title: 'Team Collaboration',
                description: 'Work together seamlessly with built-in collaboration tools'
              },
              {
                title: 'Progress Analytics',
                description: 'Monitor and analyze change adoption with real-time metrics'
              }
            ].map((feature, index) => (
                <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                      }
                    }}
                >
                  <Typography
                      variant="h6"
                      sx={{
                        mb: 1,
                        fontWeight: 600
                      }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                      variant="body1"
                      color="text.secondary"
                  >
                    {feature.description}
                  </Typography>
                </Paper>
            ))}
          </Box>

        </Box>
      </Container>
  );
};

export default LandingPage;