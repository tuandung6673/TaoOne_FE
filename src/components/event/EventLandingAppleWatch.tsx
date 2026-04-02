import { Button } from "primereact/button";
import { useEffect, useMemo, useRef, useState } from "react";
import classes from "./EventLandingAppleWatch.module.scss";
import LeadForm from "./LeadForm";
import { CAM_KET, QUA_TANG } from "../../constants/constants";

type SectionId = "tong-quan" | "loi-ich" | "uu-dai" | "faq" | "dang-ky";

const SECTION_ORDER: { id: SectionId; label: string }[] = [
    { id: "tong-quan", label: "Tổng quan" },
    { id: "loi-ich", label: "Lợi ích" },
    { id: "uu-dai", label: "Ưu đãi" },
    { id: "faq", label: "FAQ" },
    { id: "dang-ky", label: "Đăng ký" },
];

function scrollToSection(id: SectionId) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function EventLandingAppleWatch() {
    const [activeSection, setActiveSection] = useState<SectionId>("tong-quan");
    const observerRef = useRef<IntersectionObserver | null>(null);

    const highlights = useMemo(
        () => [
            { title: "Bảo hành rõ ràng", desc: "Cam kết minh bạch & hỗ trợ tận tâm." },
            { title: "Giá tốt theo đợt", desc: "Ưu đãi theo số lượng & thời gian." },
            { title: "Quà tặng kèm", desc: "Tặng phụ kiện/ưu đãi kèm theo." },
            { title: "Ship COD", desc: "Nhận hàng kiểm tra rồi thanh toán." },
            { title: "Hỗ trợ lên đời", desc: "Thu cũ đổi mới, tư vấn nhanh." },
            { title: "Tư vấn chọn size", desc: "Chọn size/dây phù hợp cổ tay." },
        ],
        []
    );

    useEffect(() => {
        const prevTitle = document.title;
        document.title = "Sự kiện Apple Watch | TaoOne";
        return () => {
            document.title = prevTitle;
        };
    }, []);

    useEffect(() => {
        const ids = SECTION_ORDER.map((s) => s.id);
        const elements = ids
            .map((id) => document.getElementById(id))
            .filter(Boolean) as HTMLElement[];

        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
                if (!visible?.target?.id) return;
                setActiveSection(visible.target.id as SectionId);
            },
            {
                root: null,
                // Favor “top-ish” detection so sticky nav feels responsive
                rootMargin: "-20% 0px -70% 0px",
                threshold: [0.05, 0.1, 0.2],
            }
        );

        elements.forEach((el) => observerRef.current?.observe(el));

        return () => observerRef.current?.disconnect();
    }, []);

    return (
        <div className={classes.page}>
            <div className={classes.heroWrap} id="top">
                <div className={classes.heroInner}>
                    <div className={classes.heroText}>
                        <div className={classes.kicker}>Ưu đãi theo đợt • Số lượng có hạn</div>
                        <h1 className={classes.h1}>
                            Sự kiện Apple Watch
                            <br />
                            Giá tốt — Quà tặng — Hỗ trợ trọn gói
                        </h1>
                        <p className={classes.subhead}>
                            Bạn muốn một chiếc Apple Watch <span className={classes.em}>đúng nhu cầu</span>,{" "}
                            <span className={classes.em}>đúng ngân sách</span>, và{" "}
                            <span className={classes.em}>mua an tâm</span>? Đăng ký để nhận tư vấn & ưu đãi theo đợt.
                        </p>

                        <div className={classes.heroCtas}>
                            <Button
                                label="Đăng ký nhận ưu đãi"
                                className={classes.primaryCta}
                                onClick={() => scrollToSection("dang-ky")}
                            />
                            <button className={classes.secondaryCta} onClick={() => scrollToSection("uu-dai")}>
                                Xem ưu đãi
                            </button>
                        </div>

                        <div className={classes.microTrust}>
                            <span>• Tư vấn nhanh</span>
                            <span>• Minh bạch</span>
                            <span>• Cam kết rõ ràng</span>
                        </div>
                    </div>

                    <div className={classes.heroMedia} aria-label="Hình sản phẩm (placeholder)">
                        <div className={classes.mediaCard}>
                            <div className={classes.mediaBadge}>Ảnh sản phẩm</div>
                            <div className={classes.mediaPlaceholder} />
                            <div className={classes.mediaCaption}>
                                Thay ảnh thật Apple Watch của TaoOne tại đây (không dùng ảnh Apple bản quyền).
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={classes.stickyNavWrap}>
                <div className={classes.stickyNav}>
                    <div className={classes.navLeft}>Apple Watch</div>
                    <div className={classes.navLinks} role="navigation" aria-label="Điều hướng nội dung">
                        {SECTION_ORDER.map((s) => (
                            <button
                                key={s.id}
                                className={`${classes.navLink} ${activeSection === s.id ? classes.navLinkActive : ""}`}
                                onClick={() => scrollToSection(s.id)}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                    <div className={classes.navRight}>
                        <Button
                            label="Đăng ký"
                            className={classes.navCta}
                            onClick={() => scrollToSection("dang-ky")}
                        />
                    </div>
                </div>
            </div>

            <section className={classes.section} id="tong-quan">
                <div className={classes.container}>
                    <h2 className={classes.h2}>Điểm nổi bật</h2>
                    <p className={classes.lede}>
                        Tóm tắt nhanh những điều bạn quan tâm nhất — để quyết định dễ hơn trong 30 giây.
                    </p>
                    <div className={classes.highlightsGrid}>
                        {highlights.map((h) => (
                            <div key={h.title} className={classes.highlightCard}>
                                <div className={classes.cardTitle}>{h.title}</div>
                                <div className={classes.cardDesc}>{h.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={classes.sectionAlt}>
                <div className={classes.container}>
                    <div className={classes.split}>
                        <div>
                            <h2 className={classes.h2}>Vấn đề thường gặp khi mua Apple Watch</h2>
                            <ul className={classes.bullets}>
                                <li>Không biết chọn <b>đời máy / size</b> nào cho đúng.</li>
                                <li>Lo ngại <b>nguồn gốc</b>, chất lượng, và hậu mãi.</li>
                                <li>Giá thị trường <b>mỗi nơi một kiểu</b>, khó so sánh.</li>
                                <li>Mua xong mới phát hiện <b>không hợp nhu cầu</b>.</li>
                            </ul>
                        </div>
                        <div className={classes.splitCard}>
                            <div className={classes.splitCardLabel}>Giải pháp của TaoOne</div>
                            <div className={classes.splitCardTitle}>Tư vấn đúng nhu cầu + ưu đãi theo đợt</div>
                            <div className={classes.splitCardDesc}>
                                Bạn để lại thông tin, TaoOne sẽ liên hệ tư vấn mẫu phù hợp ngân sách và gửi ưu đãi (nếu còn
                                suất).
                            </div>
                            <button className={classes.inlineLink} onClick={() => scrollToSection("dang-ky")}>
                                Đăng ký ngay →
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className={classes.section} id="loi-ich">
                <div className={classes.container}>
                    <h2 className={classes.h2}>Lợi ích cốt lõi</h2>
                    <div className={classes.benefitGrid}>
                        <div className={classes.benefit}>
                            <div className={classes.benefitTitle}>Theo dõi sức khoẻ & vận động</div>
                            <div className={classes.benefitDesc}>Tối ưu thói quen, tập luyện, và nhịp sống hằng ngày.</div>
                        </div>
                        <div className={classes.benefit}>
                            <div className={classes.benefitTitle}>Tiện lợi cho công việc</div>
                            <div className={classes.benefitDesc}>Nhận thông báo, cuộc gọi, lịch hẹn nhanh gọn.</div>
                        </div>
                        <div className={classes.benefit}>
                            <div className={classes.benefitTitle}>Phù hợp phong cách</div>
                            <div className={classes.benefitDesc}>Chọn size/dây phù hợp cổ tay, dùng đi làm/đi chơi.</div>
                        </div>
                        <div className={classes.benefit}>
                            <div className={classes.benefitTitle}>Mua an tâm</div>
                            <div className={classes.benefitDesc}>Cam kết & chính sách rõ ràng giúp bạn quyết định tự tin.</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={classes.sectionAlt} id="uu-dai">
                <div className={classes.container}>
                    <h2 className={classes.h2}>So sánh giá & ưu đãi</h2>
                    <p className={classes.lede}>
                        Phần này bạn sẽ thay số thực tế sau. Mục tiêu là giúp khách thấy rõ “giá trị nhận được”.
                    </p>

                    <div className={classes.priceCompare}>
                        <div className={classes.priceCol}>
                            <div className={classes.priceLabel}>Giá thị trường</div>
                            <div className={classes.priceValue}>XX.XXX.XXXđ</div>
                            <div className={classes.priceNote}>Tuỳ nơi • Tuỳ phụ kiện • Tuỳ bảo hành</div>
                        </div>
                        <div className={classes.priceColEmph}>
                            <div className={classes.priceLabel}>Ưu đãi TaoOne</div>
                            <div className={classes.priceValue}>YY.YYY.XXXđ</div>
                            <div className={classes.priceNote}>Theo đợt • Có quà tặng • Có cam kết</div>
                        </div>
                    </div>

                    <div className={classes.bonusRow}>
                        <div className={classes.bonusBox}>
                            <div className={classes.bonusTitle}>Quà tặng / Bonus</div>
                            <ul className={classes.smallList}>
                                {QUA_TANG.map((t) => (
                                    <li key={t}>{t}</li>
                                ))}
                            </ul>
                        </div>
                        <div className={classes.bonusBox}>
                            <div className={classes.bonusTitle}>Cam kết</div>
                            <ul className={classes.smallList}>
                                {CAM_KET.map((t) => (
                                    <li key={t}>{t}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className={classes.urgencyBar}>
                        <div className={classes.urgencyTitle}>Đừng chờ đến khi hết suất</div>
                        <div className={classes.urgencyDesc}>
                            Ưu đãi theo đợt và số lượng giới hạn. Khi hết suất, giá/quà tặng có thể thay đổi.
                        </div>
                        <Button
                            label="Giữ suất ưu đãi"
                            className={classes.primaryCta}
                            onClick={() => scrollToSection("dang-ky")}
                        />
                    </div>
                </div>
            </section>

            <section className={classes.section} id="faq">
                <div className={classes.container}>
                    <h2 className={classes.h2}>Câu hỏi thường gặp</h2>
                    <div className={classes.faq}>
                        <details className={classes.faqItem}>
                            <summary>TaoOne sẽ liên hệ trong bao lâu?</summary>
                            <div className={classes.faqBody}>Thường trong giờ làm việc. Bạn có thể ghi chú khung giờ tiện nghe máy.</div>
                        </details>
                        <details className={classes.faqItem}>
                            <summary>Ưu đãi có áp dụng cho tất cả mẫu không?</summary>
                            <div className={classes.faqBody}>Tuỳ đợt và tình trạng hàng. TaoOne sẽ báo rõ mẫu/size áp dụng khi liên hệ.</div>
                        </details>
                        <details className={classes.faqItem}>
                            <summary>Chính sách đổi trả / bảo hành thế nào?</summary>
                            <div className={classes.faqBody}>Sẽ hiển thị minh bạch tại đây theo chính sách TaoOne (tạm dùng nội dung placeholder).</div>
                        </details>
                    </div>
                </div>
            </section>

            <section className={classes.sectionAlt} id="dang-ky">
                <div className={classes.container}>
                    <div className={classes.formHeader}>
                        <h2 className={classes.h2}>Đăng ký nhận ưu đãi</h2>
                        <p className={classes.lede}>
                            Điền thông tin để TaoOne tư vấn mẫu phù hợp và gửi ưu đãi theo đợt (nếu còn suất).
                        </p>
                    </div>
                    <LeadForm source="event" />
                </div>
            </section>
        </div>
    );
}

export default EventLandingAppleWatch;

