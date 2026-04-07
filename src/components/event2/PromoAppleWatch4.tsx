import { useEffect } from "react";
import classes from "./PromoAppleWatch4.module.scss";
import LeadForm from "../event/LeadForm";
import { CAM_KET, QUA_TANG, SOCIAL_LINKS } from "../../constants/constants";
import s4BacTachNen from "../../images/s4_bac_tachnen.png";
import s4DenTachNen from "../../images/s4_den_tachnen.png";
import s4HongTachNen from "../../images/s4_hong_tachnen.png";

const PAIN_POINTS = [
    {
        icon: "pi pi-money-bill",
        title: "Không muốn bỏ hơn chục triệu",
        desc: "Apple Watch mới giá từ 7–10 triệu, quá cao cho nhu cầu cơ bản.",
    },
    {
        icon: "pi pi-wifi",
        title: "Chỉ cần những tính năng thiết yếu",
        desc: "Theo dõi sức khoẻ, nhận thông báo, tập luyện — không cần tính năng dư thừa.",
    },
    {
        icon: "pi pi-thumbs-down-fill",
        title: "Ngại mua hàng cũ không rõ nguồn",
        desc: "Sợ pin kém, lỗi vặt, bảo hành mập mờ, mua xong không có ai hỗ trợ.",
    },
];

const BENEFITS = [
    { icon: "pi pi-stop", title: "Màn hình lớn, rõ ràng", desc: "Hiển thị thông tin trực quan, dễ đọc ngay trên cổ tay." },
    { icon: "pi pi-heart-fill", title: "Theo dõi sức khỏe toàn diện", desc: "Nhịp tim, vận động, giấc ngủ — mọi thứ một nơi." },
    { icon: "pi pi-bolt", title: "Kết nối thông minh", desc: "Nhận cuộc gọi, tin nhắn, thông báo trực tiếp trên đồng hồ." },
    { icon: "pi pi-verified", title: "Thiết kế vẫn rất hiện đại", desc: "Series 4 không lỗi thời — vẫn đẹp, vẫn sang, vẫn ổn định." },
];

const HERO_IMAGES = [
    { src: s4DenTachNen, alt: "Apple Watch Series 4 - Màu đen" },
    { src: s4BacTachNen, alt: "Apple Watch Series 4 - Màu bạc" },
    { src: s4HongTachNen, alt: "Apple Watch Series 4 - Màu hồng" },
] as const;

const TIKTOK_EMBEDS: { videoId: string; embedUrl: string }[] = [
    { videoId: "1", embedUrl: "https://www.youtube.com/embed/b0QI6H4Gjuc" },
    { videoId: "2", embedUrl: "https://www.youtube.com/embed/3wf4NscVtc4" },
    { videoId: "3", embedUrl: "https://www.youtube.com/embed/7NzKntOXvXQ" },
];

const PAIR_GUIDE_YT_EMBED = "https://www.youtube.com/embed/XJwem3xE_k0";

const CUSTOMER_FEEDBACK = [
    {
        stars: "★★★★★",
        quote: "Lần đầu dùng Apple Watch, shop hướng dẫn ghép iPhone từng bước. Máy đẹp, pin xài cả ngày ổn.",
        author: "Anh Minh — TP.HCM",
    },
    {
        stars: "★★★★★",
        quote: "Giao nhanh, được kiểm tra trước khi trả tiền. Series 4 đúng như mô tả, không phải lo hàng dựng.",
        author: "Chị Hương — Đà Nẵng",
    },
    {
        stars: "★★★★★",
        quote: "Tư vấn thật chứ không ép mua. Mua xong vẫn nhắn hỏi thăm — cảm giác an tâm.",
        author: "Bạn Kiên — Hà Nội",
    },
];

const PROMISE_ITEMS = [
    { icon: "pi pi-check", title: "Cam kết đúng mô tả", desc: "Hàng thực tế đúng như mô tả, không nói quá." },
    { icon: "pi pi-search", title: "Bao test – bao kiểm tra", desc: "Kiểm tra kỹ trước khi giao, pin tốt, mượt mà." },
    { icon: "pi pi-wrench", title: "Hỗ trợ đổi nếu lỗi phần cứng", desc: "Phát sinh lỗi phần cứng sẽ được hỗ trợ đổi máy." },
    { icon: "pi pi-compass", title: "Tư vấn đúng nhu cầu", desc: "Không ép mua — tư vấn thật sự phù hợp ngân sách bạn." },
];

function scrollToForm() {
    const el = document.getElementById("cta-form");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function PromoAppleWatch4() {
    useEffect(() => {
        const prev = document.title;
        document.title = "Apple Watch Series 4 Giá Tốt | TáoOne";
        return () => { document.title = prev; };
    }, []);

    return (
        <div className={classes.page}>

            {/* ── HERO ── */}
            <section className={classes.hero}>
                <div className={classes.heroOverlay} />
                <div className={classes.heroInner}>
                    <div className={classes.heroText}>
                        <div className={classes.heroBadge}>Số lượng giới hạn • Không còn sản xuất mới</div>
                        <h1 className={classes.heroH1}>
                            Apple Watch Series 4
                            <br />
                            <span className={classes.heroAccent}>Chính hãng — Giá chỉ từ 2.990.000đ</span>
                        </h1>
                        <p className={classes.heroSub}>
                            Chiếc Apple Watch <b>"đủ xài nhất"</b> cho người muốn trải nghiệm hệ sinh thái Apple với chi phí tối ưu.
                            Đã kiểm tra kỹ, pin tốt, dùng mượt cho nhu cầu hằng ngày.
                        </p>
                        <div className={classes.heroCtas}>
                            <button className={classes.ctaPrimary} onClick={scrollToForm}>
                                Xem mẫu đang có – Nhận báo giá ngay
                            </button>
                            <button className={classes.ctaSecondary} onClick={scrollToForm}>
                                Nhận ưu đãi hôm nay
                            </button>
                        </div>
                        <div className={classes.heroTrust}>
                            <span>✓ Hơn 300 khách đã mua</span>
                            <span>✓ Freeship toàn quốc</span>
                            <span>✓ Kiểm tra trước khi thanh toán</span>
                        </div>
                    </div>
                    <div className={classes.heroMedia}>
                        <div className={classes.heroMediaStack} aria-label="Các màu Apple Watch Series 4">
                            {HERO_IMAGES.map((img) => (
                                <img
                                    key={img.alt}
                                    className={classes.heroMediaStackImg}
                                    src={img.src}
                                    alt={img.alt}
                                    loading="eager"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── VIDEO TIKTOK (3 cột dọc) ── */}
            <section className={classes.tiktokVideoSection} aria-label="Video trải nghiệm sản phẩm">
                <div className={classes.tiktokVideoHead}>
                    <div className={classes.tiktokVideoLabel}>Xem nhanh</div>
                    <h2 className={classes.tiktokVideoTitle}>Trên tay & review Apple Watch chính hãng</h2>
                </div>
                <div className={classes.tiktokVideoRow}>
                    {TIKTOK_EMBEDS.map(({ videoId, embedUrl }) => (
                        <div key={videoId} className={classes.tiktokVideoCell}>
                            <div className={classes.tiktokVideoFrame}>
                                <iframe
                                    src={embedUrl}
                                    title={`YouTube video ${videoId}`}
                                    allow="encrypted-media; picture-in-picture; fullscreen"
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── PAIN POINTS ── */}
            <section className={classes.section}>
                <div className={classes.container}>
                    <div className={classes.sectionLabel}>Bạn đang gặp vấn đề này?</div>
                    <h2 className={classes.h2}>Lý do nhiều người chưa dám mua Apple Watch</h2>
                    <div className={classes.painGrid}>
                        {PAIN_POINTS.map((p) => (
                            <div key={p.title} className={classes.painCard}>
                                <div className={classes.painIcon} aria-hidden>
                                    <i className={p.icon} />
                                </div>
                                <div className={classes.painTitle}>{p.title}</div>
                                <div className={classes.painDesc}>{p.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── GIẢI PHÁP ── */}
            <section className={classes.sectionDark}>
                <div className={classes.container}>
                    <div className={classes.splitSolution}>
                        <div className={classes.solutionText}>
                            <div className={classes.sectionLabel}>Giải pháp</div>
                            <h2 className={classes.h2White}>
                                Apple Watch Series 4 —<br />
                                Cân bằng hoàn hảo giữa giá tiền, tính năng và độ ổn định
                            </h2>
                            <ul className={classes.solutionList}>
                                <li>Đã được kiểm tra kỹ, <b>pin tốt</b>, sử dụng mượt cho nhu cầu hằng ngày</li>
                                <li><b>Tiết kiệm 5–7 triệu</b> so với mua Apple Watch mới nhất</li>
                                <li>Đầy đủ tính năng: sức khoẻ, thông báo, cuộc gọi, thanh toán</li>
                                <li>Hỗ trợ <b>trước – trong – sau bán</b>, không bán xong là mất hút</li>
                            </ul>
                        </div>
                        <div className={classes.solutionMediaWrap}>
                            <div className={classes.solutionMedia}>
                                <div className={classes.mediaPlaceholderDark}>
                                    {/* <span>Ảnh Apple Watch Series 4<br />trên tay / lifestyle</span> */}
                                    <img
                                        src='https://firebasestorage.googleapis.com/v0/b/taoone-c4bb7.appspot.com/o/PROD%2FS456_nhom_hong%20(10).JPEG?alt=media&token=8b2b08ff-a232-4976-8ae0-17019a8eb6c5'
                                        alt="Apple Watch Series 4"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={classes.solutionCta}>
                        <button className={classes.ctaPrimary} onClick={scrollToForm}>
                            Nhận ưu đãi ngay →
                        </button>
                    </div>
                </div>
            </section>

            {/* ── LỢI ÍCH ── */}
            <section className={classes.section}>
                <div className={classes.container}>
                    <div className={classes.sectionLabel}>Tính năng nổi bật</div>
                    <h2 className={classes.h2}>Lợi ích chính của Apple Watch Series 4</h2>
                    <div className={classes.benefitGrid}>
                        {BENEFITS.map((b) => (
                            <div key={b.title} className={classes.benefitCard}>
                                <div className={classes.benefitIcon} aria-hidden>
                                    <i className={b.icon} />
                                </div>
                                <div className={classes.benefitTitle}>{b.title}</div>
                                <div className={classes.benefitDesc}>{b.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── LIFESTYLE PHOTOS ── */}
            <section className={classes.sectionGray}>
                <div className={classes.container}>
                    <div className={classes.sectionLabel}>Hình ảnh thực tế</div>
                    <h2 className={classes.h2}>Chỉ còn lại số lượng rất hạn chế</h2>
                    <div className={classes.photoGrid}>
                        <div className={classes.photoPlaceholder}>
                            <img
                                src="https://firebasestorage.googleapis.com/v0/b/taoone-c4bb7.appspot.com/o/PROD%2FIMG_5219.jpg?alt=media&token=620631f8-62f2-4287-9df2-305baa9d464b"
                                alt="Apple Watch Series 4 - Ảnh thực tế 1"
                                loading="lazy"
                            />
                        </div>
                        <div className={classes.photoPlaceholder}>
                            <img
                                src="https://firebasestorage.googleapis.com/v0/b/taoone-c4bb7.appspot.com/o/PROD%2FIMG_5222.jpg?alt=media&token=0376c23f-72e7-4da2-9c6d-7e7ef4d5bf02"
                                alt="Apple Watch Series 4 - Ảnh thực tế 2"
                                loading="lazy"
                            />
                        </div>
                        <div className={classes.photoPlaceholder}>
                            <img
                                src="https://firebasestorage.googleapis.com/v0/b/taoone-c4bb7.appspot.com/o/PROD%2FIMG_5227.jpg?alt=media&token=3df952ae-e6ab-4b4a-9714-9c581dd7f732"
                                alt="Apple Watch Series 4 - Ảnh thực tế 3"
                                loading="lazy"
                            />
                        </div>
                        <div className={classes.photoPlaceholder}>
                            <img
                                src="https://firebasestorage.googleapis.com/v0/b/taoone-c4bb7.appspot.com/o/PROD%2FIMG_5225.jpg?alt=media&token=fd652bce-72b3-4dc7-83cd-9ec380c4b82f"
                                alt="Apple Watch Series 4 - Ảnh thực tế 4"
                                loading="lazy"
                            />
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
                        <button className={classes.ctaPrimary} onClick={scrollToForm}>
                            Nhận ưu đãi ngay →
                        </button>
                    </div>
                </div>
            </section>

            {/* ── SOCIAL PROOF ── */}
            <section className={classes.section}>
                <div className={classes.container}>
                    <div className={classes.proofRow}>
                        <div className={classes.proofStat}>
                            <div className={classes.proofNumber}>300+</div>
                            <div className={classes.proofLabel}>khách hàng đã mua và phản hồi tốt</div>
                        </div>
                        <div className={classes.proofDivider} />
                        <div className={classes.proofPoints}>
                            <p>Nhiều khách mua lần đầu Apple Watch chọn Series 4 vì <b>dễ dùng, ổn định</b></p>
                            <p>Có hỗ trợ trước – trong – sau bán, <b>không bán xong là mất hút</b></p>
                            <p>Hàng đẹp, <b>pin tốt</b>, không phải lo lắng về chất lượng</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── BẢNG GIÁ SO SÁNH ── */}
            <section className={classes.sectionDark}>
                <div className={classes.container}>
                    <div className={classes.sectionLabel}>So sánh giá</div>
                    <h2 className={classes.h2White}>Tại sao chọn Series 4 thay vì mua mới?</h2>
                    <div className={classes.priceTable}>
                        <div className={classes.priceCol}>
                            <div className={classes.priceColHeader}>Apple Watch Mới</div>
                            <div className={classes.priceAmount}>7 – 10 triệu</div>
                            <ul className={classes.priceList}>
                                <li>Tính năng nhiều hơn nhu cầu</li>
                                <li>Chi phí cao</li>
                                <li>Dư tính năng không dùng tới</li>
                            </ul>
                        </div>
                        <div className={classes.priceCol}>
                            <div className={classes.priceColHeader}>Series cao hơn (S5 – S9)</div>
                            <div className={classes.priceAmount}>5 – 8 triệu</div>
                            <ul className={classes.priceList}>
                                <li>Tính năng vẫn dư thừa</li>
                                <li>Giá vẫn còn cao</li>
                                <li>Không cần thiết với nhu cầu cơ bản</li>
                            </ul>
                        </div>
                        <div className={`${classes.priceCol} ${classes.priceColHighlight}`}>
                            <div className={classes.priceColBadge}>Lựa chọn tốt nhất</div>
                            <div className={classes.priceColHeader}>Apple Watch Series 4 tại shop</div>
                            <div className={classes.priceAmountAccent}>Chỉ từ 2.990.000đ</div>
                            <ul className={classes.priceList}>
                                <li>✓ Đủ tính năng cần thiết</li>
                                <li>✓ Tiết kiệm 5–7 triệu</li>
                                <li>✓ Đã kiểm tra kỹ, bảo hành rõ ràng</li>
                                <li>✓ Hỗ trợ đầy đủ sau mua</li>
                            </ul>
                            <button className={classes.ctaPrimary} onClick={scrollToForm} style={{ marginTop: "16px", width: "100%" }}>
                                Chốt ngay hôm nay
                            </button>
                        </div>
                    </div>
                    {/* Ưu đãi chốt đơn */}
                    <div className={classes.dealBar}>
                        <div className={classes.dealTitle}>Ưu đãi chốt đơn hôm nay</div>
                        <div className={classes.dealItems}>
                            <span className={classes.dealItem}>🎁 Giảm thêm cho khách chốt trong hôm nay</span>
                            <span className={classes.dealItem}>🚚 Freeship toàn quốc</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── QUÀ TẶNG ── */}
            <section className={classes.section}>
                <div className={classes.container}>
                    <div className={classes.giftWrap}>
                        <div className={classes.giftLeft}>
                            <div className={classes.sectionLabel}>Giá trị cộng thêm</div>
                            <h2 className={classes.h2}>Mua kèm quà tặng hấp dẫn</h2>
                            <ul className={classes.giftList}>
                                {QUA_TANG.map((t) => (
                                    <li key={t}>{t}</li>
                                ))}
                                <li>Hỗ trợ cài đặt, hướng dẫn sử dụng chi tiết cho người mới</li>
                            </ul>
                        </div>
                        <div className={classes.giftRight}>
                            <div className={classes.giftPlaceholder}>
                                <img
                                    className={classes.giftImage}
                                    src="https://scontent.fhan2-3.fna.fbcdn.net/v/t1.15752-9/663411647_25991328973895829_1903081013089547257_n.png?_nc_cat=101&ccb=1-7&_nc_sid=9f807c&_nc_ohc=NxQeXUJgongQ7kNvwEZvxvo&_nc_oc=AdqjtEeTPauoo-BDUC_2Hqjgbs5oUK1l-9QzzDNjRev-8nPzK3PYzitvucM4oiDCdow&_nc_zt=23&_nc_ht=scontent.fhan2-3.fna&_nc_ss=7a3a8&oh=03_Q7cD5AH80R_ruEiUd_ppShrQtqcK30c5BDWv2iGI-iOkqKcbIA&oe=69FC4DBB"
                                    alt="Quà tặng kèm theo"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── KHAN HIẾM ── */}
            <section className={classes.scarcity}>
                <div className={classes.container}>
                    <div className={classes.scarcityInner}>
                        <div className={classes.scarcityIcon}>⏳</div>
                        <h2 className={classes.scarcityH2}>Series 4 hiện không còn sản xuất mới</h2>
                        <p className={classes.scarcityDesc}>
                            Hàng đẹp, pin tốt không có nhiều. Mỗi đợt chỉ về <b>số lượng rất hạn chế</b>.
                            <br />
                            Hết là phải chờ đợt khác — <b>không giữ giá</b>.
                        </p>
                        <button className={classes.ctaPrimary} onClick={scrollToForm}>
                            Nhận ưu đãi ngay →
                        </button>
                    </div>
                </div>
            </section>

            {/* ── HƯỚNG DẪN GHÉP APPLE WATCH ── */}
            <section className={classes.pairGuideSection} aria-label="Hướng dẫn ghép Apple Watch với iPhone">
                <div className={classes.container}>
                    <div className={classes.pairGuideGrid}>
                        <div>
                            <div className={classes.sectionLabel}>Sau khi nhận máy</div>
                            <h2 className={classes.h2}>Cách ghép Apple Watch Series 4 với iPhone</h2>
                            <p className={classes.pairGuideLead}>
                                Series 4 ghép qua app <b>Watch</b> trên iPhone. Bạn chỉ cần iPhone đã đăng nhập iCloud, bật Bluetooth và Wi‑Fi;
                                đồng hồ đặt sát máy là có thể bắt đầu.
                            </p>
                            <ul className={classes.pairGuideList}>
                                <li>Mở app <b>Watch</b> → <b>Bắt đầu ghép nối</b> → quét animation trên mặt đồng hồ.</li>
                                <li>Chọn <b>cổ tay</b> (trái/phải), đồng ý điều khoản, chờ đồng bộ vài phút.</li>
                                <li>Tạo <b>mã PIN</b> trên đồng hồ để bảo vệ khi tháo khỏi tay.</li>
                                <li>Bật <b>Thông báo</b>, <b>Sức khỏe</b>, <b>Phòng tập</b> theo nhu cầu — có thể chỉnh sau trong app.</li>
                                <li>Nếu đồng hồ đã từng ghép máy khác: cần <b>xóa/ghi đè</b> trong Cài đặt trên đồng hồ hoặc nhờ shop reset trước khi ghép máy mới.</li>
                            </ul>
                            <div className={classes.pairGuideNote}>
                                <b>Mua tại TáoOne:</b> được hỗ trợ ghép nối và cài đặt cơ bản — xem video bên cạnh hoặc inbox để được chỉ từng bước.
                            </div>
                        </div>
                        <div className={classes.pairGuideMedia}>
                            <iframe
                                src={PAIR_GUIDE_YT_EMBED}
                                title="Ghép đôi Apple Watch"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CAM KẾT ── */}
            <section className={classes.sectionGray}>
                <div className={classes.container}>
                    <div className={classes.sectionLabel}>Cam kết của TáoOne</div>
                    <h2 className={classes.h2}>Mua an tâm — hỗ trợ tận tâm</h2>
                    <div className={classes.promiseGrid}>
                        {PROMISE_ITEMS.map((p) => (
                            <div key={p.title} className={classes.promiseCard}>
                                <div className={classes.promiseIcon} aria-hidden>
                                    <i className={p.icon} />
                                </div>
                                <div className={classes.promiseTitle}>{p.title}</div>
                                <div className={classes.promiseDesc}>{p.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PHẢN HỒI KHÁCH HÀNG ── */}
            <section className={classes.section}>
                <div className={classes.container}>
                    <div className={classes.sectionLabel}>Khách đã nói gì?</div>
                    <h2 className={classes.h2}>Feedback từ người đã mua</h2>
                    <div className={classes.feedbackGrid}>
                        {CUSTOMER_FEEDBACK.map((f) => (
                            <div key={f.author} className={classes.feedbackCard}>
                                <div className={classes.feedbackStars} aria-hidden>{f.stars}</div>
                                <p className={classes.feedbackQuote}>“{f.quote}”</p>
                                <div className={classes.feedbackAuthor}>{f.author}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA MẠNH + FORM ── */}
            <section className={classes.sectionDark} id="cta-form">
                <div className={classes.container}>
                    <div className={classes.formWrap}>
                        <div className={classes.formLeft}>
                            <div className={classes.sectionLabel}>Hành động</div>
                            <h2 className={classes.h2White}>
                                Inbox ngay để xem mẫu Apple Watch Series 4 đang có
                            </h2>
                            <p className={classes.formSubtext}>
                                Nhận giá tốt nhất và ưu đãi trong hôm nay. Số lượng có hạn — đừng để lỡ.
                            </p>
                            <div className={classes.formTrustList}>
                                {CAM_KET.map((c) => (
                                    <div key={c} className={classes.formTrustItem}>✓ {c}</div>
                                ))}
                            </div>
                        </div>
                        <div className={classes.formRight}>
                            <LeadForm source="promo-aws4" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CHÍNH SÁCH ── */}
            <section className={classes.section}>
                <div className={classes.container}>
                    <div className={classes.sectionLabel}>Chính sách minh bạch</div>
                    <h2 className={classes.h2}>Không lo rủi ro khi mua</h2>
                    <div className={classes.policyGrid}>
                        <div className={classes.policyCard}>
                            <div className={classes.policyIcon} aria-hidden>
                                <i className="pi pi-search" />
                            </div>
                            <div className={classes.policyTitle}>Kiểm tra hàng trước khi thanh toán</div>
                            <div className={classes.policyDesc}>Mở hộp kiểm tra tình trạng sản phẩm trước khi trả tiền.</div>
                        </div>
                        <div className={classes.policyCard}>
                            <div className={classes.policyIcon} aria-hidden>
                                <i className="pi pi-shield" />
                            </div>
                            <div className={classes.policyTitle}>Bảo hành rõ ràng</div>
                            <div className={classes.policyDesc}>Bảo hành minh bạch, hỗ trợ đổi nếu lỗi phần cứng.</div>
                        </div>
                        <div className={classes.policyCard}>
                            <div className={classes.policyIcon} aria-hidden>
                                <i className="pi pi-globe" />
                            </div>
                            <div className={classes.policyTitle}>Giao hàng toàn quốc</div>
                            <div className={classes.policyDesc}>Ship COD toàn quốc — nhận hàng rồi mới thanh toán.</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── LIÊN HỆ ── */}
            <section className={classes.contact}>
                <div className={classes.container}>
                    <h2 className={classes.h2White}>Liên hệ với TáoOne</h2>
                    <p className={classes.contactSub}>Sẵn sàng tư vấn — phản hồi nhanh trong giờ làm việc</p>
                    <div className={classes.contactLinks}>
                        <a
                            href={SOCIAL_LINKS.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={classes.contactBtn}
                        >
                            Facebook / Inbox
                        </a>
                        <a
                            href={`https://zalo.me/${SOCIAL_LINKS.mobile.replace("+84", "0")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={classes.contactBtn}
                        >
                            Zalo
                        </a>
                        <a
                            href={`tel:${SOCIAL_LINKS.mobile}`}
                            className={classes.contactBtnOutline}
                        >
                            Hotline: {SOCIAL_LINKS.mobile}
                        </a>
                    </div>
                </div>
            </section>

        </div>
    );
}

export default PromoAppleWatch4;
