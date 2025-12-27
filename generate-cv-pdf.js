/**
 * Generate CV PDF from HTML
 * 
 * Requirements:
 * - Node.js installed
 * - Hugo server running (hugo server)
 * 
 * Usage:
 * 1. npm install puppeteer
 * 2. hugo server (in another terminal)
 * 3. node generate-cv-pdf.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const CONFIG = {
    url: 'http://localhost:1313/NetworkingPrograming/cv.html',
    outputPath: path.join(__dirname, 'static', 'cv.pdf'),
    format: 'A4',
    printBackground: true,
    margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm'
    }
};

async function generatePDF() {
    console.log('🚀 Starting CV PDF generation...');
    
    let browser;
    try {
        // Launch browser
        console.log('📱 Launching browser...');
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Set viewport for consistent rendering
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 2
        });
        
        // Navigate to CV page
        console.log(`🌐 Loading ${CONFIG.url}...`);
        await page.goto(CONFIG.url, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Wait for fonts to load
        await page.evaluateHandle('document.fonts.ready');
        
        // Additional wait for any animations
        await page.waitForTimeout(1000);
        
        // Generate PDF
        console.log('📄 Generating PDF...');
        await page.pdf({
            path: CONFIG.outputPath,
            format: CONFIG.format,
            printBackground: CONFIG.printBackground,
            margin: CONFIG.margin,
            preferCSSPageSize: false
        });
        
        // Check file size
        const stats = fs.statSync(CONFIG.outputPath);
        const fileSizeInKB = (stats.size / 1024).toFixed(2);
        
        console.log('✅ CV PDF generated successfully!');
        console.log(`📁 Location: ${CONFIG.outputPath}`);
        console.log(`📊 Size: ${fileSizeInKB} KB`);
        
    } catch (error) {
        console.error('❌ Error generating PDF:', error.message);
        
        if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
            console.error('\n💡 Make sure Hugo server is running:');
            console.error('   hugo server');
        }
        
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Check if output directory exists
const outputDir = path.dirname(CONFIG.outputPath);
if (!fs.existsSync(outputDir)) {
    console.log(`📁 Creating directory: ${outputDir}`);
    fs.mkdirSync(outputDir, { recursive: true });
}

// Run
generatePDF().then(() => {
    console.log('\n🎉 Done! You can now use the PDF:');
    console.log('   - View: open static/cv.pdf');
    console.log('   - Build: hugo --cleanDestinationDir');
    console.log('   - Test: http://localhost:1313/NetworkingPrograming/cv.pdf');
    process.exit(0);
}).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
