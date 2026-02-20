/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Connect from './pages/Connect';
import Clubs from './pages/Clubs';
import Hangouts from './pages/Hangouts';
import Gigs from './pages/Gigs';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
import Admin from './pages/Admin';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/hangouts" element={<Hangouts />} />
          <Route path="/gigs" element={<Gigs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
}

