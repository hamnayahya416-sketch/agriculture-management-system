import { createAsyncThunk } from "@reduxjs/toolkit";
import { addBuyer, updateBuyer } from "../actions/buyerActions";
import { selectAvailableStockById } from "../selectors/cropSelectors";
import { digitsOf, validateCnic, validateName, validateQuantity } from "../../utils/validators";
import { todayIso } from "../../utils/formatters";

/* Validates a buyer against stock + duplicate CNIC, then saves it to the store. */
export const saveBuyer = createAsyncThunk(
  "buyers/save",
  async (input, { getState, dispatch, rejectWithValue }) => {
    const state = getState();

    const nameError = validateName(input.name);
    if (nameError) return rejectWithValue(nameError);

    const cnicError = validateCnic(input.cnic);
    if (cnicError) return rejectWithValue(cnicError);

    if (!input.imageBase64) return rejectWithValue("A photo is required.");

    const crop = state.crops.items.find((entry) => String(entry.id) === String(input.cropId));
    if (!crop) return rejectWithValue("Please choose a valid crop.");

    const available = selectAvailableStockById(state, crop.id);
    const quantityError = validateQuantity(input.quantity, available);
    if (quantityError) return rejectWithValue(quantityError);

    const cnic = digitsOf(input.cnic);
    const duplicate = state.buyers.items.some(
      (entry) => digitsOf(entry.cnic) === cnic && String(entry.id) !== String(input.id || "")
    );
    if (duplicate) return rejectWithValue("A buyer with this CNIC already exists.");

    const buyer = {
      id: input.id,
      name: String(input.name).trim(),
      cnic,
      imageBase64: input.imageBase64,
      cropId: crop.id,
      quantity: Number(input.quantity),
      date: input.date || todayIso(),
    };

    if (buyer.id) {
      dispatch(updateBuyer(buyer));
    } else {
      delete buyer.id;
      dispatch(addBuyer(buyer));
    }
    return buyer;
  }
);

export default saveBuyer;
