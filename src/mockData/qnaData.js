const QA_SECTIONS_RAW = [
  {
    id: "mua-xe",
    title: "Mua xe",
    items: [
      {
        id: "mua-xe-1",
        question: "Làm sao để mua một chiếc xe trên hệ thống?",
        answer:
          "Bạn chỉ cần chọn xe, đặt cọc để giữ chỗ, chờ Admin tạo lịch inspection, tham gia buổi kiểm tra thực tế, rồi thanh toán phần còn lại nếu đồng ý mua xe.",
        updatedAt: "2026-03-31",
      },
      {
        id: "mua-xe-2",
        question: "Tôi có thể đặt cọc cho xe khi nào?",
        answer:
          "Bạn chỉ có thể đặt cọc khi xe vẫn còn khả dụng, chưa bị người khác giữ chỗ và chưa được bán.",
        updatedAt: "2026-03-31",
      },
      {
        id: "mua-xe-3",
        question:
          "Nếu tôi đã đặt cọc rồi thì chiếc xe có còn mở cho người khác mua không?",
        answer:
          "Không, sau khi đặt cọc được xác nhận, hệ thống sẽ giữ xe cho bạn và không cho người mua khác đặt cọc cùng lúc.",
        updatedAt: "2026-03-31",
      },
      {
        id: "mua-xe-4",
        question: "Nếu ví của tôi không đủ tiền cọc thì sao?",
        answer:
          "Hệ thống sẽ chỉ yêu cầu bạn thanh toán phần còn thiếu để hoàn tất tiền cọc, thay vì bắt bạn nạp lại toàn bộ số tiền.",
        updatedAt: "2026-03-31",
      },
      {
        id: "mua-xe-5",
        question: "Tôi có thể thanh toán phần tiền còn lại khi nào?",
        answer:
          "Bạn chỉ được thanh toán phần còn lại sau khi inspection hoàn tất và vẫn còn số tiền phải trả cho giao dịch đó.",
        updatedAt: "2026-03-31",
      },
    ],
  },
  {
    id: "kiem-tra-xe",
    title: "Kiểm tra xe",
    items: [
      {
        id: "kiem-tra-xe-1",
        question: "Ai là người tạo lịch kiểm tra xe?",
        answer:
          "Chỉ Admin mới có quyền tạo lịch inspection, chọn thời gian, địa điểm và phân công Inspector cho giao dịch.",
        updatedAt: "2026-03-31",
      },
      {
        id: "kiem-tra-xe-2",
        question: "Buổi kiểm tra xe sẽ diễn ra ở đâu?",
        answer:
          "Tất cả giao dịch trực tiếp và inspection phải diễn ra tại địa điểm do hệ thống quản lý, như event location hoặc Safe Zone.",
        updatedAt: "2026-03-31",
      },
      {
        id: "kiem-tra-xe-3",
        question: "Tôi có cần check-in khi đến nơi gặp không?",
        answer:
          "Có, Buyer, Seller và Inspector được phân công đều phải check-in tại địa điểm giao dịch để quy trình chính thức bắt đầu.",
        updatedAt: "2026-03-31",
      },
      {
        id: "kiem-tra-xe-4",
        question: "Nếu một bên đến trễ thì có sao không?",
        answer:
          "Nếu Buyer hoặc Seller không check-in trong vòng 30 phút kể từ giờ hẹn, hệ thống sẽ ghi nhận là no-show và xem đó là một vi phạm.",
        updatedAt: "2026-03-31",
      },
      {
        id: "kiem-tra-xe-5",
        question: "Ai được phép tạo inspection report?",
        answer:
          "Chỉ Inspector được phân công cho reservation đó hoặc Admin mới được tạo inspection report.",
        updatedAt: "2026-03-31",
      },
      {
        id: "kiem-tra-xe-6",
        question: "Kết luận của Inspector có quan trọng không?",
        answer:
          "Có, kết luận kỹ thuật của Inspector là căn cứ cuối cùng cho việc xử lý chia cọc và settlement trong giao dịch.",
        updatedAt: "2026-03-31",
      },
    ],
  },
  {
    id: "huy-giao-dich-hoan-tien",
    title: "Huỷ giao dịch và hoàn tiền",
    items: [
      {
        id: "huy-1",
        question: "Tôi có thể huỷ giao dịch trước khi hoàn tất mua xe không?",
        answer:
          "Có, hệ thống cho phép huỷ reservation trước khi giao dịch hoàn tất, và cách xử lý hoàn tiền sẽ phụ thuộc vào tình trạng giao dịch và loại yêu cầu huỷ.",
        updatedAt: "2026-03-31",
      },
      {
        id: "huy-2",
        question: "Khi nào tôi được hoàn lại 100% tiền cọc?",
        answer:
          "Bạn có thể được hoàn 100% tiền cọc trong các trường hợp huỷ hợp lệ trước khi hoàn tất giao dịch, hoặc khi yêu cầu hoàn tiền được Admin phê duyệt đúng quy trình.",
        updatedAt: "2026-03-31",
      },
      {
        id: "huy-3",
        question: "Nếu inspection thất bại thì tôi có được hoàn cọc không?",
        answer:
          "Có, khi inspection thất bại trong listing deal, hệ thống sẽ hoàn toàn bộ tiền cọc cho Buyer nếu yêu cầu đến từ Buyer, Admin hoặc Inspector được phân công.",
        updatedAt: "2026-03-31",
      },
      {
        id: "huy-4",
        question: "Nếu Seller không xuất hiện tại buổi gặp thì sao?",
        answer:
          "Khi Seller no-show làm inspection thất bại, Buyer sẽ được hoàn toàn bộ tiền cọc và nhận thêm 200.000 VND tiền bồi thường.",
        updatedAt: "2026-03-31",
      },
      {
        id: "huy-5",
        question: "Nếu Buyer không xuất hiện tại buổi gặp thì sao?",
        answer:
          "Khi Buyer no-show, hệ thống có thể chia tiền cọc theo cơ chế bồi hoàn, trong đó 50% được trả cho Seller và 50% còn lại thuộc về nền tảng.",
        updatedAt: "2026-03-31",
      },
      {
        id: "huy-6",
        question: "Nếu tôi huỷ nhưng chiếc xe vẫn đúng mô tả thì sao?",
        answer:
          "Nếu Buyer từ chối hoặc huỷ giao dịch dù xe đúng như mô tả, tiền cọc của Buyer có thể bị mất theo chính sách Buyer Forfeit.",
        updatedAt: "2026-03-31",
      },
      {
        id: "huy-7",
        question: "Nếu xe không đúng như thông tin đăng bán thì sao?",
        answer:
          "Nếu inspection xác nhận xe không khớp với mô tả trên listing, hệ thống sẽ áp dụng chính sách Seller Forfeit để xử lý settlement.",
        updatedAt: "2026-03-31",
      },
    ],
  },
  {
    id: "ban-xe-dang-tin",
    title: "Bán xe và đăng tin",
    items: [
      {
        id: "ban-xe-1",
        question: "Tôi cần gì để đăng bán xe?",
        answer:
          "Seller phải có đầy đủ số điện thoại và địa chỉ trong hồ sơ trước khi được phép tạo listing.",
        updatedAt: "2026-03-31",
      },
      {
        id: "ban-xe-2",
        question: "Tin đăng của tôi có hiển thị ngay không?",
        answer:
          "Chưa chắc, listing chỉ được kích hoạt sau khi các điều kiện liên quan được đáp ứng, bao gồm việc xử lý phí đăng tin thành công và hoàn tất xác nhận từ hệ thống thanh toán khi áp dụng.",
        updatedAt: "2026-03-31",
      },
      {
        id: "ban-xe-3",
        question:
          "Nếu hệ thống thanh toán xác nhận hai lần thì có bị trừ tiền hai lần không?",
        answer:
          "Không, hệ thống chỉ áp dụng logic xác nhận phí đăng tin hoặc thanh toán cuối cùng một lần, còn các xác nhận lặp lại sẽ bị bỏ qua.",
        updatedAt: "2026-03-31",
      },
      {
        id: "ban-xe-4",
        question: "Khi nào Seller nhận được tiền bán xe?",
        answer:
          "Hệ thống chỉ giải ngân cho Seller khi reservation đã đạt trạng thái đủ điều kiện payout, và cũng bảo đảm không chi trả hai lần cho cùng một giao dịch.",
        updatedAt: "2026-03-31",
      },
      {
        id: "ban-xe-5",
        question: "Sau khi giao dịch thành công, tiền sẽ đi đâu?",
        answer:
          "Sau khi giao dịch hoàn tất hợp lệ, nền tảng sẽ settlement và chuyển tiền cho Seller theo rule của hệ thống, bao gồm xử lý tiền cọc và các khoản liên quan.",
        updatedAt: "2026-03-31",
      },
      {
        id: "ban-xe-6",
        question: "Nếu có tranh chấp thì ai xử lý?",
        answer:
          "Admin có quyền can thiệp và đưa ra quyết định settlement cuối cùng cho những trường hợp tranh chấp không nằm trong luồng tự động chuẩn.",
        updatedAt: "2026-03-31",
      },
    ],
  },
];

export const QA_SECTIONS = QA_SECTIONS_RAW.map((section) => ({
  ...section,
  items: section.items.map((item) => ({
    ...item,
    category: section.id,
  })),
}));
