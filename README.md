# 🏠 Bengaluru House Price Prediction

An end-to-end machine learning project that predicts house prices in Bengaluru based on location, size (BHK), and total square footage. The project covers data cleaning, EDA, feature engineering, model training/tuning, and deployment via a FastAPI backend with a custom frontend.

---

## 📌 Overview

Real estate prices in Bengaluru vary massively by locality. This project builds a regression model on the popular **Bengaluru House Data** dataset to estimate a property's price given:
- **Location**
- **Size** (number of bedrooms/BHK)
- **Total square footage**

The trained model is served through a FastAPI backend and consumed by a frontend UI, making it usable as a real, interactive web app rather than just a notebook experiment.

---

## 🧠 Model Performance

Multiple models were trained and compared, with **XGBoost** (after hyperparameter tuning via `RandomizedSearchCV`) selected as the final model.

| Model | Train R² | Test R² |
|---|---|---|
| Linear Regression | 0.648 | 0.688 |
| Decision Tree Regressor | 0.979 | 0.766 |
| **XGBoost (tuned)** | **0.931** | **0.815** |

**Final model metrics (XGBoost, tuned):**
- MAE: ₹21,29,338
- MAPE: 23.85%
- Average error relative to mean price (~₹96.9 lakh): ~21.96%

---

## 🗂️ Project Structure

```
##house price prediction##/
│
├── backend/            # FastAPI backend serving the trained model
│   ├── main.py
│   └── requirements.txt
│
├── Datasets/            # Raw and cleaned datasets
│
├── frontend/            # Frontend UI for user interaction
│
├── notebooks/            # Jupyter notebooks
│   ├── Data_Cleaning.ipynb
│   └── Building_Model.ipynb
│
└── README.md
```

---

## 🧹 Data Cleaning (`Data_Cleaning.ipynb`)

- Loaded the raw `Bengaluru_House_Data.csv` and kept only the relevant columns: `location`, `total_sqft`, `size`, `price`.
- Removed 529 duplicate rows.
- Handled missing values:
  - `location` → filled with the most frequent location.
  - `size` → extracted the numeric BHK value from text (e.g. "2 BHK" → `2`).
  - `total_sqft` → parsed ranges like `"2100 - 2850"` into their mean, and filled remaining nulls with the median.
- Reduced location cardinality by grouping any location with fewer than 10 listings into a single **"Other"** category.
- Exported the cleaned data to `cleaned_dataset.csv`.

---

## 🏗️ Feature Engineering & Model Building (`Building_Model.ipynb`)

- Explored relationships between `total_sqft`, `size`, and `price` using scatter plots, histograms, and a correlation heatmap.
- Removed unrealistic listings where `total_sqft / size < 300` (likely data errors).
- Engineered a `price_per_sqft` feature and removed per-location outliers using the **IQR method**.
- Built a preprocessing pipeline:
  - Log-transform + StandardScaler for numeric features.
  - OneHotEncoder for the `location` categorical feature.
- Trained and compared **Linear Regression**, **XGBoost**, and **Decision Tree Regressor** models.
- Tuned XGBoost and Decision Tree hyperparameters using `RandomizedSearchCV`.
- Saved the best-performing pipeline (XGBoost) as a `.pkl` file using `joblib`.

---

## ⚙️ Backend (FastAPI)

The backend exposes a simple REST API to serve predictions from the trained model.

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check / welcome message |
| `POST` | `/predict` | Returns predicted price for given inputs |

### Request body for `/predict`

```json
{
  "size": 3,
  "total_sqft": 1500,
  "location": "Whitefield"
}
```

### Response

```json
{
  "predicted_price": 8234567.12
}
```

Any location not seen during training is automatically mapped to `"Other"`, matching the preprocessing done during training.

### Running the backend locally

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`, with interactive docs at `http://127.0.0.1:8000/docs`.

> ⚠️ **Note:** Make sure the trained model file name in `backend/` matches the one referenced in `main.py` (`joblib.load(...)`). Rename the `.pkl` file if needed, since filenames like `xgb_model(1).pkl` and `xgb_model_1_.pkl` may not match depending on how the file was downloaded.

---

## 🎨 Frontend

The `frontend/` folder contains a custom UI that lets users input the house's size, area, and location, and view the predicted price returned by the backend API.

---

## 🛠️ Tech Stack

- **Language:** Python
- **Data Analysis:** Pandas, NumPy
- **Visualization:** Matplotlib, Seaborn
- **Machine Learning:** Scikit-learn, XGBoost
- **Backend:** FastAPI, Pydantic, Uvicorn
- **Model Persistence:** Joblib

---

## 🚀 Future Improvements

- Improve model accuracy with additional features (e.g. amenities, floor number, age of property).
- Deploy the backend to a cloud service (Render/Railway/AWS) for public access.
- Add input validation feedback and better error handling on the frontend.
- Experiment with ensemble/stacking models to reduce MAPE further.

---

## 👤 Author

**Mohit Kumar**
- GitHub: [mohit-jangraa](https://github.com/mohit-jangraa)
- LinkedIn: [Mohit Kumar](https://linkedin.com/in/mohit-kumar-234a42412)

---

## 📄 License

This project is open-source and available for learning purposes.
