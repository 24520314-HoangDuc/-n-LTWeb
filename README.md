# LTWeb - Status Report

## 1. Tinh trang hien tai

- Frontend va backend da ket noi theo luong API.
- Du lieu sample trong Twit.js da duoc loai bo.
- Feed hien lay bai viet tu MongoDB qua endpoint `/api/posts`.
- Cac thao tac tao bai viet, repost, them/xoa comment da goi API backend va luu DB.
- Backend khoi dong thanh cong bang `npm start`.
- Van con loi ket noi Atlas: khong the ket noi den cluster do van de IP Access / network access.

## 2. Tien trinh da hoan thanh

### Backend

- Da xu ly merge conflict trong backend.js.
- Da cai dependencies can thiet: express, mongoose, body-parser, dotenv.
- Da them script start trong package.json.
- Da bo sung xoa comment theo kieu cascade (xoa comment con cung nhanh).

### Frontend

- Da loai bo danh sach posts mau hard-code trong Twit.js.
- Da them luong load du lieu tu API khi khoi dong trang.
- Da map du lieu tu MongoDB ve model frontend (post/comment/date/likedBy).
- Da chuyen tao bai viet va comment sang call API.
- Da xu ly loading/error state khi khong load duoc du lieu tu backend.

### Cau hinh

- Da cap nhat .env theo chuoi ket noi MongoDB.
- Da thu ca 2 dang URI:
- `mongodb+srv://...`
- `mongodb://host1,host2,host3/...`
- Da xac nhan DNS va cong 27017 co the resolve/test o moi truong hien tai.

## 3. Van de dang ton tai

- Ung dung da chay, nhung MongoDB Atlas van tra loi theo huong "IP chua duoc allow".
- Nguyen nhan kha nang cao:
- IP public dang thay doi (Wi-Fi/VPN/Proxy).
- Rule IP Access List duoc them nham project hoac chua apply dung cluster.
- Mat khau user DB trong chuoi ket noi khong dung.

## 4. Viec can lam tiep theo

1. Trong Atlas, vao Network Access va them lai IP public hien tai (hoac tam mo `0.0.0.0/0` de test).
2. Kiem tra dung project va dung cluster trong Atlas.
3. Kiem tra lai Database Access (username/password) trong chuoi ket noi.
4. Sau khi cap nhat Atlas, chay lai:

```bash
npm start
```

5. Khi thay log `MongoDB connected successfully`, mo Twit.html de test feed/create/comment.

## 5. Ghi chu nhanh

- Trang thai code hien tai: co the chay server va goi API.
- Blocker chinh hien tai: quyen truy cap MongoDB Atlas theo IP/network.
