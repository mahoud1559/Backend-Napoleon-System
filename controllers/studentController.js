const Student = require("../models/StudentModel");
const Group = require("../models/groupModel");
const Center = require("../models/centerModel");

const addStudent = async (req, res) => {
  const { name, phone, parentPhone, grade, group, code, payment } = req.body;
  console.log(name, phone, parentPhone, grade, group, code, payment);
  console.log("Grade: ", grade);
  try {
    if (
      !name ||
      !phone ||
      !parentPhone ||
      !grade ||
      !group ||
      !code ||
      !payment
    ) {
      throw Error("All fields are required.");
    }
    if (phone == parentPhone) {
      throw Error("Phone and parent phone can not be the same");
    }
    if (phone.length !== 11 || parentPhone.length !== 11) {
      console.log("Phone numbers should have exactly 11 digits.");
      return res
        .status(422)
        .json({ error: "Phone numbers should have exactly 11 digits." });
    }
    console.log("passed 11 digits test");
    const digitsRegex = /^\d+$/;
    console.log("Is phone valid:", digitsRegex.test(phone));
    console.log("Is parent phone valid:", digitsRegex.test(parentPhone));
    if (!digitsRegex.test(phone) || !digitsRegex.test(parentPhone)) {
      console.log("Phone numbers should consist of digits only.");
      return res
        .status(422)
        .json({ error: "Phone numbers should consist of digits only." });
    }
    console.log("passed type of digits test");
    if (!phone.startsWith("01") || !parentPhone.startsWith("01")) {
      console.log("You can reserve with Egyptian Numbers only..");
      return res
        .status(422)
        .json({ error: "You can reserve with Egyptian Numbers only.." });
    }
    console.log("passed 01 digits test");

    const checkStudent = await Student.findOne({ code });
    if (checkStudent) {
      throw Error("Student already exists");
    } else {
      const findGroup = await Group.findOne({ name: group });
      if (!findGroup) {
        throw Error("Group does not exist");
      } else {
        if (findGroup.validSeats === 0) {
          throw Error("لا يوجد مقاعد متاحة في هذه المجموعة");
        } else {
          const student = new Student({
            name,
            phone,
            parentPhone,
            grade,
            group: findGroup,
            code,
            payment,
          });
          await student.save();
          console.log("Student added successfully..");
          findGroup.validSeats = findGroup.validSeats - 1;
          await findGroup.save();
          res.status(201).json(student);
        }
      }
    }
  } catch (error) {
    console.log("Can not add student");
    res.status(400).json({ error: error.message });
  }
};
const searchCode = async (req, res) => {
  const { query } = req.query;
  console.log("searched code is: ", query);
  try {
    const searchResults = await Student.find({ code: query }).populate("group");
    console.log("Search results:", searchResults);

    res.json({ message: "Search results:", results: searchResults });
  } catch (error) {
    console.error("Error in search query:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getStudent = async (req, res) => {
  const { grade, group } = req.body;
  console.log("search queries: ", grade, group);
  try {
    let query = { grade };
    if (group) {
      const groupExists = await Group.findOne({ name: group });
      if (groupExists) {
        query.group = groupExists._id;
      }
    }
    const students = await Student.find(query).populate("group");
    res.status(200).json(students);
  } catch (error) {
    console.error("Error in filtering students by grade and groups:", error);
    res
      .status(500)
      .json({ error: "Error in filtering students by grade and groups:" });
  }
};
const deleteStudent = async (req, res) => {
  const { code } = req.params;
  console.log("Code to delete: ", code);
  try {
    const student = await Student.findOne({ code });
    if (!student) {
      throw Error("Student does not exist");
    } else {
      const group = await Group.findOne({ _id: student.group });
      group.validSeats = group.validSeats + 1;
      console.log("Group: ", group);
      await student.deleteOne({ code });
      await group.save();

      res.status(200).json({ message: "Student deleted successfully" });
    }
  } catch (error) {
    console.error("Error in deleting student:", error);
    res.status(500).json({ error: "Error in deleting student:" });
  }
};

const deleteAllStudents = async (req, res) => {
  try {
    await Student.deleteMany({});
    res.status(200).json({ message: "All students deleted successfully" });
  } catch (error) {
    console.error("Error in deleting all students:", error);
    res.status(500).json({ error: "Error in deleting all students:" });
  }
};

const editStudent = async (req, res) => {
  const { id } = req.params;
  console.log("Student ID: ", id);
  const { code, name, phone, parentPhone, grade, group, payment } = req.body;
  console.log(
    "Student data: ",
    code,
    name,
    phone,
    parentPhone,
    grade,
    group,
    payment
  );
  const checkStudent = await Student.findOne({ code });

  try {
    const student = await Student.findOne({ _id: id });
    const studentGroup = await Group.findOne({ _id: student.group });
    const wantedGroup = await Group.findOne({ name: group });
    if (!student) {
      throw Error("هذا الطالب غير مسجل");
    } else {
      if (studentGroup.name !== group && group) {
        if (wantedGroup.validSeats === 0) {
          throw Error("لا يمكن تسحيل الطالب بهذه المجموعة");
        } else {
          if (wantedGroup.grade !== student.grade) {
            studentGroup.validSeats = studentGroup.validSeats + 1;
            wantedGroup.validSeats = wantedGroup.validSeats - 1;
            student.grade = wantedGroup.grade;
            student.group = wantedGroup._id;
            await student.save();
            await studentGroup.save();
            await wantedGroup.save();
            console.log("student has been moved to another grade and group.");
            res.status(200).json({
              message: `تم تعديل بيانات الطالب ${student.name} بنجاح`,
            });
          } else {
            studentGroup.validSeats = studentGroup.validSeats + 1;
            wantedGroup.validSeats = wantedGroup.validSeats - 1;
            student.group = wantedGroup._id;
            await student.save();
            await studentGroup.save();
            await wantedGroup.save();
            console.log("student has been moved to another group.");
            res.status(200).json({
              message: `تم تعديل بيانات الطالب ${student.name} بنجاح`,
            });
          }
        }
      } else {
        if (checkStudent && checkStudent.code !== student.code) {
          throw Error("هذا الكود مسجل بالفعل");
        }
        code ? (student.code = code) : (student.code = student.code);
        name ? (student.name = name) : (student.name = student.name);
        phone ? (student.phone = phone) : (student.phone = student.phone);
        parentPhone
          ? (student.parentPhone = parentPhone)
          : (student.parentPhone = student.parentPhone);
        grade ? (student.grade = grade) : (student.grade = student.grade);
        group
          ? (student.group = studentGroup._id)
          : (student.group = student.group);

        if (payment !== undefined && payment !== null && payment !== "") {
          student.payment = payment;
        } else {
          student.payment = student.payment;
        }
        await student.save();
        console.log("Student has been edited successfully");
        res
          .status(200)
          .json({ message: `تم تعديل بيانات الطالب ${student.name} بنجاح` });
      }
    }
  } catch (error) {
    console.error("Error in editing student:", error);
    res
      .status(500)
      .json({ error: "خطأ في تسجيل البيانات", message: error.message });
  }
};

const payStudent = async (req, res) => {
  const { id } = req.params;
  const { paymentPrice} = req.body;
  try {
    const student = await Student.findById(id).populate("group");
    const center = await Center.findOne({ name: student.group.center });
    // console.log("Center: ", center);
    if (!student) {
      throw Error("Student not found");
    }
    if (paymentPrice === 0) {
      throw Error("يجب إدخال قيمة الدفع");
    }
    if (paymentPrice < 0) {
      throw Error("لا يمكن إدخال قيمة سالبة");
    }
    if (paymentPrice > student.group.pricePerMonth) {
      throw Error("القيمة المدخلة أكبر من مستحقات الشهر");
    }
    const group = await Group.findById(student.group._id);
    if(group.payment === "دفع بالحصة" && paymentPrice < group.pricePerClass){
        throw Error("القيمة المدخلة أقل من قيمة الحصة");
    }
    if(group.payment === "دفع بالشهر" && paymentPrice < group.pricePerMonth){
        throw Error("القيمة المدخلة أقل من قيمة الشهر");
    }
    if (paymentPrice === student.group.pricePerMonth) {
      student.paymentStatus = "دفع"
      center.remaining = center.remaining + paymentPrice;
    }
    await center.save();
    await student.save();
    console.log("Student: ", student);
    // console.log("Payment: ", payment);
    res.status(200).json({ message: "تم الدفع بنجاح" });
  }
  catch (error) {
    console.error("Error in paying:", error);
    res.status(500).json({ error: error.message });
  }
}
module.exports = {
  addStudent,
  getStudent,
  searchCode,
  deleteAllStudents,
  deleteStudent,
  editStudent,
  payStudent
};
