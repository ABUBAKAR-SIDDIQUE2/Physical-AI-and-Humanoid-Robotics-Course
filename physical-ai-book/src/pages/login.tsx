import React from 'react';
import Layout from '@theme/Layout';
import { LoginForm } from '../components/Auth/LoginForm';

function LoginPage() {
  return (
    <Layout title="Login" description="Login or Sign Up for Physical AI Course">
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <LoginForm />
      </main>
    </Layout>
  );
}

export default LoginPage;
