import { useEffect } from "react";
import classes from "./PromoAppleWatch4.module.scss";
import LeadForm from "../event/LeadForm";
import { CAM_KET, QUA_TANG, SOCIAL_LINKS } from "../../constants/constants";

const PAIN_POINTS = [
    {
        icon: "💸",
        title: "Không muốn bỏ hơn chục triệu",
        desc: "Apple Watch mới giá từ 7–10 triệu, quá cao cho nhu cầu cơ bản.",
    },
    {
        icon: "🎯",
        title: "Chỉ cần những tính năng thiết yếu",
        desc: "Theo dõi sức khoẻ, nhận thông báo, tập luyện — không cần tính năng dư thừa.",
    },
    {
        icon: "😟",
        title: "Ngại mua hàng cũ không rõ nguồn",
        desc: "Sợ pin kém, lỗi vặt, bảo hành mập mờ, mua xong không có ai hỗ trợ.",
    },
];

const BENEFITS = [
    { icon: "📱", title: "Màn hình lớn, rõ ràng", desc: "Hiển thị thông tin trực quan, dễ đọc ngay trên cổ tay." },
    { icon: "❤️", title: "Theo dõi sức khỏe toàn diện", desc: "Nhịp tim, vận động, giấc ngủ — mọi thứ một nơi." },
    { icon: "📲", title: "Kết nối thông minh", desc: "Nhận cuộc gọi, tin nhắn, thông báo trực tiếp trên đồng hồ." },
    { icon: "⌚", title: "Thiết kế vẫn rất hiện đại", desc: "Series 4 không lỗi thời — vẫn đẹp, vẫn sang, vẫn ổn định." },
];

const PROMISE_ITEMS = [
    { icon: "✅", title: "Cam kết đúng mô tả", desc: "Hàng thực tế đúng như mô tả, không nói quá." },
    { icon: "🔍", title: "Bao test – bao kiểm tra", desc: "Kiểm tra kỹ trước khi giao, pin tốt, mượt mà." },
    { icon: "🔄", title: "Hỗ trợ đổi nếu lỗi phần cứng", desc: "Phát sinh lỗi phần cứng sẽ được hỗ trợ đổi máy." },
    { icon: "🤝", title: "Tư vấn đúng nhu cầu", desc: "Không ép mua — tư vấn thật sự phù hợp ngân sách bạn." },
];

function scrollToForm() {
    const el = document.getElementById("cta-form");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function PromoAppleWatch4() {
    useEffect(() => {
        const prev = document.title;
        document.title = "Apple Watch Series 4 Giá Tốt | TaoOne";
        return () => { document.title = prev; };
    }, []);

    return (
        <div className={classes.page}>

            {/* ── HERO ── */}
            <section className={classes.hero}>
                <div className={classes.heroOverlay} />
                <div className={classes.heroContent}>
                    <div className={classes.heroBadge}>Số lượng giới hạn • Không còn sản xuất mới</div>
                    <h1 className={classes.heroH1}>
                        Apple Watch Series 4
                        <br />
                        <span className={classes.heroAccent}>Chính hãng — Giá chỉ từ X.XXX.000đ</span>
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
            </section>

            {/* ── PAIN POINTS ── */}
            <section className={classes.section}>
                <div className={classes.container}>
                    <div className={classes.sectionLabel}>Bạn đang gặp vấn đề này?</div>
                    <h2 className={classes.h2}>Lý do nhiều người chưa dám mua Apple Watch</h2>
                    <div className={classes.painGrid}>
                        {PAIN_POINTS.map((p) => (
                            <div key={p.title} className={classes.painCard}>
                                <div className={classes.painIcon}>{p.icon}</div>
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
                            <div className={classes.sectionLabel} style={{ color: "#f97316" }}>Giải pháp</div>
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
                                    <span>Ảnh Apple Watch Series 4<br />trên tay / lifestyle</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={classes.solutionCta}>
                        <button className={classes.ctaPrimary} onClick={scrollToForm}>
                            Xem mẫu đang có – Nhận báo giá ngay →
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
                                <div className={classes.benefitIcon}>{b.icon}</div>
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
                        <div className={classes.photoPlaceholder}><span>Ảnh trên tay 1</span></div>
                        <div className={classes.photoPlaceholder}><span>Ảnh trên tay 2</span></div>
                        <div className={classes.photoPlaceholder}><span>Ảnh lifestyle 3</span></div>
                        <div className={classes.photoPlaceholder}><span>Ảnh mặt đồng hồ chi tiết</span></div>
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
                    <div className={classes.sectionLabel} style={{ color: "#f97316" }}>So sánh giá</div>
                    <h2 className={classes.h2White}>Tại sao chọn Series 4 thay vì mua mới?</h2>
                    <div className={classes.priceTable}>
                        <div className={classes.priceCol}>
                            <div className={classes.priceColHeader}>Apple Watch Mới</div>
                            <div className={classes.priceAmount}>7–10 triệu</div>
                            <ul className={classes.priceList}>
                                <li>Tính năng nhiều hơn nhu cầu</li>
                                <li>Chi phí cao</li>
                                <li>Dư tính năng không dùng tới</li>
                            </ul>
                        </div>
                        <div className={classes.priceCol}>
                            <div className={classes.priceColHeader}>Series cao hơn (S5–S9)</div>
                            <div className={classes.priceAmount}>5–8 triệu</div>
                            <ul className={classes.priceList}>
                                <li>Tính năng vẫn dư thừa</li>
                                <li>Giá vẫn còn cao</li>
                                <li>Không cần thiết với nhu cầu cơ bản</li>
                            </ul>
                        </div>
                        <div className={`${classes.priceCol} ${classes.priceColHighlight}`}>
                            <div className={classes.priceColBadge}>Lựa chọn tốt nhất</div>
                            <div className={classes.priceColHeader}>Apple Watch Series 4 tại shop</div>
                            <div className={classes.priceAmountAccent}>Chỉ từ X.XXX.000đ</div>
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
                                <li>- Hỗ trợ cài đặt, hướng dẫn sử dụng chi tiết cho người mới</li>
                            </ul>
                        </div>
                        <div className={classes.giftRight}>
                            <div className={classes.giftPlaceholder}>
                                <span>🎁</span>
                                <p>Quà tặng kèm theo</p>
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
                            Xem mẫu còn hàng ngay →
                        </button>
                    </div>
                </div>
            </section>

            {/* ── CAM KẾT ── */}
            <section className={classes.sectionGray}>
                <div className={classes.container}>
                    <div className={classes.sectionLabel}>Cam kết của TaoOne</div>
                    <h2 className={classes.h2}>Mua an tâm — hỗ trợ tận tâm</h2>
                    <div className={classes.promiseGrid}>
                        {PROMISE_ITEMS.map((p) => (
                            <div key={p.title} className={classes.promiseCard}>
                                <div className={classes.promiseIcon}>{p.icon}</div>
                                <div className={classes.promiseTitle}>{p.title}</div>
                                <div className={classes.promiseDesc}>{p.desc}</div>
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
                            <div className={classes.sectionLabel} style={{ color: "#f97316" }}>Kêu gọi hành động</div>
                            <h2 className={classes.h2White}>
                                Inbox ngay để xem mẫu Series 4 đang có
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
                            <div className={classes.policyIcon}>🔎</div>
                            <div className={classes.policyTitle}>Kiểm tra hàng trước khi thanh toán</div>
                            <div className={classes.policyDesc}>Mở hộp kiểm tra tình trạng sản phẩm trước khi trả tiền.</div>
                        </div>
                        <div className={classes.policyCard}>
                            <div className={classes.policyIcon}>🛡️</div>
                            <div className={classes.policyTitle}>Bảo hành rõ ràng</div>
                            <div className={classes.policyDesc}>Bảo hành minh bạch, hỗ trợ đổi nếu lỗi phần cứng.</div>
                        </div>
                        <div className={classes.policyCard}>
                            <div className={classes.policyIcon}>🚚</div>
                            <div className={classes.policyTitle}>Giao hàng toàn quốc</div>
                            <div className={classes.policyDesc}>Ship COD toàn quốc — nhận hàng rồi mới thanh toán.</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── LIÊN HỆ ── */}
            <section className={classes.contact}>
                <div className={classes.container}>
                    <h2 className={classes.h2White}>Liên hệ với TaoOne</h2>
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
