import Script from "next/script";

/**
 * Analytics — GA4 + Search Console.
 *
 * Both wire-ups are env-driven and inert until the user fills in IDs:
 *   - NEXT_PUBLIC_GA4_ID="G-XXXXXXXX" → loads gtag.js with privacy-
 *     respecting defaults (anonymize_ip, no ad-personalization signals).
 *     Pageviews fire automatically; key events get the .gtag() helper.
 *   - NEXT_PUBLIC_GSC_VERIFICATION="<token>" → emits the
 *     google-site-verification meta tag for ownership verification.
 *
 * When neither env var is set, this component renders nothing. Safe to
 * keep in every build; activates the moment the IDs land in Vercel.
 *
 * Privacy posture matches the rest of the site: no analytics on user
 * answer values (there aren't any here, but the principle holds),
 * IP anonymized, no remarketing signals.
 */
export function Analytics() {
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;
  const gscToken = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

  return (
    <>
      {gscToken && (
        <meta name="google-site-verification" content={gscToken} />
      )}
      {ga4Id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga4Id}', {
                anonymize_ip: true,
                allow_google_signals: false,
                allow_ad_personalization_signals: false
              });
            `}
          </Script>
        </>
      )}
    </>
  );
}
