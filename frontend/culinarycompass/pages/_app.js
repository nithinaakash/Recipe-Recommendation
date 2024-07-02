// pages/_app.js

import { AuthProvider } from '../context/Authcontext'; // Fix the import statement to match the actual file name
import Head from 'next/head';
import '../styles/globals.css'; 

function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider>
            <Head>
                <title>Culinary Compass </title>
                <link rel="icon" href="/images/Food_Logo.jpg" /> {/* Setting favicon */}
            </Head>
            <Component {...pageProps} />
        </AuthProvider>
    );
}

export default MyApp;