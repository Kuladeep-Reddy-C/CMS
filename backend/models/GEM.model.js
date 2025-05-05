import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  pricePerUnit: { type: Number, required: true }
});

const MemberExpenseSchema = new mongoose.Schema({
    memberName: { type: String, required: true },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    pricePerUnit: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' }
});

const MemberExpenseSchema2 = new mongoose.Schema({
  memberName: { type: String, required: true },
  memberEmail: { type: String, required: true },    // Add this
  memberPhone: { type: String, required: true },    // Add this
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  pricePerUnit: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' }
});


const GroupDetailsSchema = new mongoose.Schema({
  date: { type: String, required: true }, // ISO date string preferred
  name: { type: String, required: true },
  paidBy: { type: String, required: true },
  place: { type: String, required: true }
});

const GroupSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  groupDetails: { type: GroupDetailsSchema, required: true },
  items: { type: [ItemSchema], required: true },
  memberExpenses: { type: [MemberExpenseSchema], required: true }
});

const Gp2 = new mongoose.Schema({
  userId: { type: String, required: true },
  groupDetails: { type: GroupDetailsSchema, required: true },
  items: { type: [ItemSchema], required: true },
  memberExpenses: { type: [MemberExpenseSchema2], required: true }
})

export const GEMmodel = mongoose.model('Group', GroupSchema);
export const GEMmodel2 = mongoose.model('Group2', Gp2);


