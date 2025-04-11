import { NextResponse, type NextRequest } from "next/server";
import { type Browser } from 'puppeteer';
import puppeteerCore, { type Browser as BrowserCore } from 'puppeteer-core';
import puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium-min';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const data = searchParams.get('data');
  const template = searchParams.get('template');

  if (!data || !template) {
    return NextResponse.json({ message: 'Missing data or template' }, { status: 400 });
  }

  try {
    let browser: Browser | BrowserCore;
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
      // In production, use puppeteer-core with @sparticuz/chromium-min.
      const executablePath = await chromium.executablePath();
      browser = await puppeteerCore.launch({
        executablePath,
        args: chromium.args,
        headless: chromium.headless,
        defaultViewport: chromium.defaultViewport,
      });
    } else {
      // In development, use the full puppeteer package (which downloads its own Chromium).
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }

    const page = await browser.newPage();
    const url = `${process.env.BASE_URL}/resume/download?data=${encodeURIComponent(data)}&template=${template}`;
    console.log("Navigating to URL:", url);
    await page.goto(url, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '10px',
        bottom: '20px',
        left: '10px'
      }
    });

    console.log("PDF generated. Buffer size:", pdfBuffer.length);

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=resume.pdf',
      },
    });
  } catch (error: any) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { message: 'Error generating PDF', error: error?.toString() },
      { status: 500 }
    );
  }
}
