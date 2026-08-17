import "./SocialBubbles.scss";
import { SOCIAL_LINKS } from "../../constants/constants";
import { useLocation } from "react-router-dom";

function MobileIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="social-bubbles-icon">
            <path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
    );
}

function FacebookIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="social-bubbles-icon">
            <path fill="currentColor" d="M22 12.06C22 6.49 17.52 2 12 2S2 6.49 2 12.06c0 5.01 3.66 9.16 8.44 9.94v-7.03H7.9v-2.91h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.78 8.44-4.93 8.44-9.94Z" />
        </svg>
    );
}

function TiktokIcon() {
    return (
        <svg viewBox="0 0 48 48" aria-hidden="true" className="social-bubbles-icon">
            <path fill="currentColor" d="M44 17.6c-4.9 0-9.2-3.2-10.6-7.6h-.1v19.8c0 6.6-5.4 12-12 12S9.3 36.4 9.3 29.8c0-6.6 5.4-12 12-12 1.1 0 2.1.2 3.1.5v5.3c-1-.5-2-.7-3.1-.7-3.8 0-6.9 3.1-6.9 6.9s3.1 6.9 6.9 6.9 6.9-3.1 6.9-6.9V4h5.4c1.3 4.5 5.4 7.8 10.4 8.2v5.4Z" />
        </svg>
    );
}

function SocialBubbles() {
    const location = useLocation();
    const isPaymentPage = location.pathname.includes('thanh-toan');

    return (
        <div className={`social-bubbles-container ${isPaymentPage ? 'social-bubbles-left' : ''}`}>
            {SOCIAL_LINKS?.tiktok && (
                <a
                className="social-bubbles-bubble social-bubbles-tiktok"
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open TikTok"
                >
                    <TiktokIcon />
                </a>
            )}
            {SOCIAL_LINKS?.facebook && (
                <a
                    className="social-bubbles-bubble social-bubbles-facebook"
                    href={SOCIAL_LINKS.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open Facebook"
                >
                    <FacebookIcon />
                </a>
            )}
            {SOCIAL_LINKS?.mobile && (
                <a
                    className="social-bubbles-bubble social-bubbles-mobile"
                    href={`tel:${SOCIAL_LINKS.mobile}`}
                    aria-label="Open Mobile"
                >
                    <MobileIcon />
                </a>
            )}
        </div>
    );
}

export default SocialBubbles;


