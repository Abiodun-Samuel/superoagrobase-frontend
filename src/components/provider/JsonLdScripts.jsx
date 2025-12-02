
import Script from 'next/script';

const JsonLdScripts = ({ generators = [] }) => {
    const scripts = generators
        .map(item => {
            if (item && typeof item === 'object' && 'fn' in item) {
                const { fn, params } = item;
                return typeof fn === 'function' ? fn(params) : null;
            }
            return typeof item === 'function' ? item() : null;
        })
        .filter(Boolean);

    return (
        <>
            {scripts.map((jsonLd, idx) => (
                <Script
                    key={`jsonld-${idx}`}
                    id={`jsonld-${idx}`}
                    type="application/ld+json"
                    strategy="beforeInteractive"
                >
                    {JSON.stringify(jsonLd)}
                </Script>
            ))}
        </>
    );
};

export default JsonLdScripts;