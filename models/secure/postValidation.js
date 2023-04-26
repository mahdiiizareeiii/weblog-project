const Yup = require("yup");

exports.schema = Yup.object().shape({
    title: Yup.string()
        .reqiured("عنوان پست الزامی است")
        .min(5, "عنوان پست نباید کمتر از 5 تا باشد")
        .max(255, "عنوان پست نباید بیشتر از 255 باشد"),
    body: Yup.string().reqiured("پست جدید باید دارای محتوا باشد"),
    status: Yup.string.oneOf(
        ["private", "public"],
        "یکی از 2 وضعیت خصوصی یا عمومی را انتخاب کنید"
    ),
});