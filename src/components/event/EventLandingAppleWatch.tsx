import { Button } from "primereact/button";
import { useEffect, useMemo, useRef, useState } from "react";
import "./EventLandingAppleWatch.scss";
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
        <div className={"event-landing-page"}>
            <div className={"event-landing-hero-wrap"} id="top">
                <div className={"event-landing-hero-inner"}>
                    <div className={"event-landing-hero-text"}>
                        <div className={"event-landing-kicker"}>Ưu đãi theo đợt • Số lượng có hạn</div>
                        <h1 className={"event-landing-h1"}>
                            Sự kiện Apple Watch
                            <br />
                            Giá tốt — Quà tặng — Hỗ trợ trọn gói
                        </h1>
                        <p className={"event-landing-subhead"}>
                            Bạn muốn một chiếc Apple Watch <span className={"event-landing-em"}>đúng nhu cầu</span>,{" "}
                            <span className={"event-landing-em"}>đúng ngân sách</span>, và{" "}
                            <span className={"event-landing-em"}>mua an tâm</span>? Đăng ký để nhận tư vấn & ưu đãi theo đợt.
                        </p>

                        <div className={"event-landing-hero-ctas"}>
                            <Button
                                label="Đăng ký nhận ưu đãi"
                                className={"event-landing-primary-cta"}
                                onClick={() => scrollToSection("dang-ky")}
                            />
                            <button className={"event-landing-secondary-cta"} onClick={() => scrollToSection("uu-dai")}>
                                Xem ưu đãi
                            </button>
                        </div>

                        <div className={"event-landing-micro-trust"}>
                            <span>• Tư vấn nhanh</span>
                            <span>• Minh bạch</span>
                            <span>• Cam kết rõ ràng</span>
                        </div>
                    </div>

                    <div className={"event-landing-hero-media"} aria-label="Hình sản phẩm (placeholder)">
                        <div className={"event-landing-media-card"}>
                            <div className={"event-landing-media-badge"}>Ảnh sản phẩm</div>
                            <div className={"event-landing-media-placeholder"} />
                            <div className={"event-landing-media-caption"}>
                                Thay ảnh thật Apple Watch của TaoOne tại đây (không dùng ảnh Apple bản quyền).
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={"event-landing-sticky-nav-wrap"}>
                <div className={"event-landing-sticky-nav"}>
                    <div className={"event-landing-nav-left"}>Apple Watch</div>
                    <div className={"event-landing-nav-links"} role="navigation" aria-label="Điều hướng nội dung">
                        {SECTION_ORDER.map((s) => (
                            <button
                                key={s.id}
                                className={`${"event-landing-nav-link"} ${activeSection === s.id ? "event-landing-nav-link-active" : ""}`}
                                onClick={() => scrollToSection(s.id)}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                    <div className={"event-landing-nav-right"}>
                        <Button
                            label="Đăng ký"
                            className={"event-landing-nav-cta"}
                            onClick={() => scrollToSection("dang-ky")}
                        />
                    </div>
                </div>
            </div>

            <section className={"event-landing-section"} id="tong-quan">
                <div className={"event-landing-container"}>
                    <h2 className={"event-landing-h2"}>Điểm nổi bật</h2>
                    <p className={"event-landing-lede"}>
                        Tóm tắt nhanh những điều bạn quan tâm nhất — để quyết định dễ hơn trong 30 giây.
                    </p>
                    <div className={"event-landing-highlights-grid"}>
                        {highlights.map((h) => (
                            <div key={h.title} className={"event-landing-highlight-card"}>
                                <div className={"event-landing-card-title"}>{h.title}</div>
                                <div className={"event-landing-card-desc"}>{h.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={"event-landing-section-alt"}>
                <div className={"event-landing-container"}>
                    <div className={"event-landing-split"}>
                        <div>
                            <h2 className={"event-landing-h2"}>Vấn đề thường gặp khi mua Apple Watch</h2>
                            <ul className={"event-landing-bullets"}>
                                <li>Không biết chọn <b>đời máy / size</b> nào cho đúng.</li>
                                <li>Lo ngại <b>nguồn gốc</b>, chất lượng, và hậu mãi.</li>
                                <li>Giá thị trường <b>mỗi nơi một kiểu</b>, khó so sánh.</li>
                                <li>Mua xong mới phát hiện <b>không hợp nhu cầu</b>.</li>
                            </ul>
                        </div>
                        <div className={"event-landing-split-card"}>
                            <div className={"event-landing-split-card-label"}>Giải pháp của TaoOne</div>
                            <div className={"event-landing-split-card-title"}>Tư vấn đúng nhu cầu + ưu đãi theo đợt</div>
                            <div className={"event-landing-split-card-desc"}>
                                Bạn để lại thông tin, TaoOne sẽ liên hệ tư vấn mẫu phù hợp ngân sách và gửi ưu đãi (nếu còn
                                suất).
                            </div>
                            <button className={"event-landing-inline-link"} onClick={() => scrollToSection("dang-ky")}>
                                Đăng ký ngay →
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className={"event-landing-section"} id="loi-ich">
                <div className={"event-landing-container"}>
                    <h2 className={"event-landing-h2"}>Lợi ích cốt lõi</h2>
                    <div className={"event-landing-benefit-grid"}>
                        <div className={"event-landing-benefit"}>
                            <div className={"event-landing-benefit-title"}>Theo dõi sức khoẻ & vận động</div>
                            <div className={"event-landing-benefit-desc"}>Tối ưu thói quen, tập luyện, và nhịp sống hằng ngày.</div>
                        </div>
                        <div className={"event-landing-benefit"}>
                            <div className={"event-landing-benefit-title"}>Tiện lợi cho công việc</div>
                            <div className={"event-landing-benefit-desc"}>Nhận thông báo, cuộc gọi, lịch hẹn nhanh gọn.</div>
                        </div>
                        <div className={"event-landing-benefit"}>
                            <div className={"event-landing-benefit-title"}>Phù hợp phong cách</div>
                            <div className={"event-landing-benefit-desc"}>Chọn size/dây phù hợp cổ tay, dùng đi làm/đi chơi.</div>
                        </div>
                        <div className={"event-landing-benefit"}>
                            <div className={"event-landing-benefit-title"}>Mua an tâm</div>
                            <div className={"event-landing-benefit-desc"}>Cam kết & chính sách rõ ràng giúp bạn quyết định tự tin.</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={"event-landing-section-alt"} id="uu-dai">
                <div className={"event-landing-container"}>
                    <h2 className={"event-landing-h2"}>So sánh giá & ưu đãi</h2>
                    <p className={"event-landing-lede"}>
                        Phần này bạn sẽ thay số thực tế sau. Mục tiêu là giúp khách thấy rõ “giá trị nhận được”.
                    </p>

                    <div className={"event-landing-price-compare"}>
                        <div className={"event-landing-price-col"}>
                            <div className={"event-landing-price-label"}>Giá thị trường</div>
                            <div className={"event-landing-price-value"}>XX.XXX.XXXđ</div>
                            <div className={"event-landing-price-note"}>Tuỳ nơi • Tuỳ phụ kiện • Tuỳ bảo hành</div>
                        </div>
                        <div className={"event-landing-price-col-emph"}>
                            <div className={"event-landing-price-label"}>Ưu đãi TaoOne</div>
                            <div className={"event-landing-price-value"}>YY.YYY.XXXđ</div>
                            <div className={"event-landing-price-note"}>Theo đợt • Có quà tặng • Có cam kết</div>
                        </div>
                    </div>

                    <div className={"event-landing-bonus-row"}>
                        <div className={"event-landing-bonus-box"}>
                            <div className={"event-landing-bonus-title"}>Quà tặng / Bonus</div>
                            <ul className={"event-landing-small-list"}>
                                {QUA_TANG.map((t) => (
                                    <li key={t}>{t}</li>
                                ))}
                            </ul>
                        </div>
                        <div className={"event-landing-bonus-box"}>
                            <div className={"event-landing-bonus-title"}>Cam kết</div>
                            <ul className={"event-landing-small-list"}>
                                {CAM_KET.map((t) => (
                                    <li key={t}>{t}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className={"event-landing-urgency-bar"}>
                        <div className={"event-landing-urgency-title"}>Đừng chờ đến khi hết suất</div>
                        <div className={"event-landing-urgency-desc"}>
                            Ưu đãi theo đợt và số lượng giới hạn. Khi hết suất, giá/quà tặng có thể thay đổi.
                        </div>
                        <Button
                            label="Giữ suất ưu đãi"
                            className={"event-landing-primary-cta"}
                            onClick={() => scrollToSection("dang-ky")}
                        />
                    </div>
                </div>
            </section>

            <section className={"event-landing-section"} id="faq">
                <div className={"event-landing-container"}>
                    <h2 className={"event-landing-h2"}>Câu hỏi thường gặp</h2>
                    <div className={"event-landing-faq"}>
                        <details className={"event-landing-faq-item"}>
                            <summary>TaoOne sẽ liên hệ trong bao lâu?</summary>
                            <div className={"event-landing-faq-body"}>Thường trong giờ làm việc. Bạn có thể ghi chú khung giờ tiện nghe máy.</div>
                        </details>
                        <details className={"event-landing-faq-item"}>
                            <summary>Ưu đãi có áp dụng cho tất cả mẫu không?</summary>
                            <div className={"event-landing-faq-body"}>Tuỳ đợt và tình trạng hàng. TaoOne sẽ báo rõ mẫu/size áp dụng khi liên hệ.</div>
                        </details>
                        <details className={"event-landing-faq-item"}>
                            <summary>Chính sách đổi trả / bảo hành thế nào?</summary>
                            <div className={"event-landing-faq-body"}>Sẽ hiển thị minh bạch tại đây theo chính sách TaoOne (tạm dùng nội dung placeholder).</div>
                        </details>
                    </div>
                </div>
            </section>

            <section className={"event-landing-section-alt"} id="dang-ky">
                <div className={"event-landing-container"}>
                    <div className={"event-landing-form-header"}>
                        <h2 className={"event-landing-h2"}>Đăng ký nhận ưu đãi</h2>
                        <p className={"event-landing-lede"}>
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

