'use client';

import React from 'react';
import {Box, Button, Container, Typography, useTheme} from '@mui/material';
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

        </Box>
      </Container>
  );
};

export default LandingPage;