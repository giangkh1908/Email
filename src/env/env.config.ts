// bỏ toàn bộ biến môi trường vào đây để dễ dàng quản lý

const envConfig = () => ({
    mongoUrl: process.env.MONGO_URL,
});

export default envConfig;