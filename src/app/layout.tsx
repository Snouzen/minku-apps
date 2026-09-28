import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIKD - Minku UB",
  description: "Task management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="antialiased">
        <Script id="cz-hydration-fix" strategy="beforeInteractive">
          {`
            (function() {
              function removeAttr() {
                if (document && document.body && document.body.hasAttribute && document.body.hasAttribute('cz-shortcut-listen')) {
                  document.body.removeAttribute('cz-shortcut-listen');
                }
              }
              removeAttr();
              try {
                var observer = new MutationObserver(function(mutations) {
                  for (var i = 0; i < mutations.length; i++) {
                    var m = mutations[i];
                    if (m.type === 'attributes' && m.attributeName === 'cz-shortcut-listen') {
                      removeAttr();
                    }
                  }
                });
                if (document && document.body) {
                  observer.observe(document.body, { attributes: true, attributeFilter: ['cz-shortcut-listen'] });
                }
              } catch (e) {}
            })();
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
