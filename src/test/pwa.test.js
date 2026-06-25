import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('PWA Configuration', () => {
  it('debe tener el ícono 192x192', () => {
    const iconPath = path.join(process.cwd(), 'public/icon-192.svg');
    expect(fs.existsSync(iconPath)).toBe(true);
    
    const content = fs.readFileSync(iconPath, 'utf8');
    expect(content).toContain('width="192"');
    expect(content).toContain('height="192"');
    expect(content).toContain('BP');
  });

  it('debe tener el ícono 512x512', () => {
    const iconPath = path.join(process.cwd(), 'public/icon-512.svg');
    expect(fs.existsSync(iconPath)).toBe(true);
    
    const content = fs.readFileSync(iconPath, 'utf8');
    expect(content).toContain('width="512"');
    expect(content).toContain('height="512"');
  });

  it('debe tener vite-plugin-pwa en package.json', () => {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    expect(pkg.devDependencies['vite-plugin-pwa']).toBeDefined();
    expect(pkg.devDependencies['workbox-window']).toBeDefined();
  });

  it('debe tener configuración PWA en vite.config.js', () => {
    const config = fs.readFileSync('vite.config.js', 'utf8');
    expect(config).toContain('VitePWA');
    expect(config).toContain('manifest');
    expect(config).toContain('Blueprint Canvas');
    expect(config).toContain('standalone');
  });

  it('debe tener meta tags PWA en index.html', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    expect(html).toContain('apple-mobile-web-app-capable');
    expect(html).toContain('theme-color');
    expect(html).toContain('#0A0F16');
  });

  it('debe tener el hook useInstallPrompt', () => {
    const hookPath = path.join(process.cwd(), 'src/hooks/useInstallPrompt.js');
    expect(fs.existsSync(hookPath)).toBe(true);
    
    const content = fs.readFileSync(hookPath, 'utf8');
    expect(content).toContain('beforeinstallprompt');
    expect(content).toContain('install');
  });

  it('debe tener el componente InstallBanner', () => {
    const componentPath = path.join(process.cwd(), 'src/components/InstallBanner.jsx');
    expect(fs.existsSync(componentPath)).toBe(true);
    
    const content = fs.readFileSync(componentPath, 'utf8');
    expect(content).toContain('useInstallPrompt');
    expect(content).toContain('Instalar');
  });

  it('debe incluir InstallBanner en App.jsx', () => {
    const appPath = path.join(process.cwd(), 'src/App.jsx');
    const content = fs.readFileSync(appPath, 'utf8');
    expect(content).toContain('InstallBanner');
  });
});
