# Hệ Thống Website Thương Mại Điện Tử (E-Commerce)

Hệ thống bán lẻ thiết bị công nghệ trực tuyến được đóng gói và vận hành phân tán bằng Docker Compose, tích hợp Reverse Proxy SSL Nginx, cơ sở dữ liệu MySQL 8.0 băm mật khẩu Bcrypt cùng cụm quan sát toàn diện Prometheus, Grafana, Loki và Promtail.

- **Sinh viên thực hiện:** Đồng Anh Tuấn
- **Mã sinh viên:** DTC245200427
- **Học phần:** Triển khai và Quản trị Hệ thống Phần mềm (ICTU 2026)
- **Đề tài số:** 09 - Website Thương mại điện tử

---

## 1. Kiến trúc hệ thống 9 Container

| Container | Vai trò | Cổng |
|---|---|---|
| `ecom_nginx` | Reverse Proxy SSL (HTTPS) | 80 -> 443 |
| `ecom_webapp` | Storefront E-Commerce (Node.js/Express) | 3000 (nội bộ) |
| `ecom_mysql` | Cơ sở dữ liệu MySQL 8.0 | 3306 (nội bộ) |
| `ecom_adminer` | Giao diện quản trị MySQL Web | 8080 |
| `ecom_node_exporter` | Thu thập metrics phần cứng Host | 9100 |
| `ecom_prometheus` | Máy chủ thu thập Time-series Metrics | 9090 |
| `ecom_grafana` | Bảng điều khiển biểu đồ Dashboard | 3001 |
| `ecom_loki` | Quản lý và lưu trữ nhật ký log tập trung | 3100 |
| `ecom_promtail` | Thu thập file log hệ thống chuyển tới Loki | 9080 |

---

## 2. Hướng dẫn khởi chạy hệ thống

```bash
# 1. Clone repository
git clone [https://github.com/aikeepsayingno/ecommerce-system-dtc245200427.git](https://github.com/aikeepsayingno/ecommerce-system-dtc245200427.git)
cd ecommerce-system-dtc245200427

# 2. Khởi động 9 containers
sudo docker compose up -d --build

# 3. Kiểm tra trạng thái
sudo docker compose ps
