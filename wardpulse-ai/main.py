from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import uvicorn

# ------------------------
# Generate Synthetic Data
# ------------------------

np.random.seed(42)

categories = ["Water", "Road", "Garbage", "Streetlight"]
area_density = ["Low", "Medium", "High"]

data = []

for _ in range(1000):
    category = np.random.choice(categories)
    density = np.random.choice(area_density)
    desc_length = np.random.randint(20, 200)
    previous_count = np.random.randint(0, 10)
    days_open = np.random.randint(0, 7)

    # Simple logic for priority
    if category == "Water" and density == "High":
        priority = "High"
    elif previous_count > 5:
        priority = "High"
    elif days_open > 4:
        priority = "Medium"
    else:
        priority = "Low"

    data.append([
        category,
        density,
        desc_length,
        previous_count,
        days_open,
        priority
    ])

df = pd.DataFrame(data, columns=[
    "category",
    "area_density",
    "desc_length",
    "previous_count",
    "days_open",
    "priority"
])

# Encode categorical
df = pd.get_dummies(df, columns=["category", "area_density"])

X = df.drop("priority", axis=1)
y = df["priority"]

model = RandomForestClassifier()
model.fit(X, y)

# ------------------------
# FastAPI App
# ------------------------

app = FastAPI()

class ComplaintInput(BaseModel):
    category: str
    areaDensity: str
    descriptionLength: int
    previousCount: int
    daysOpen: int


@app.post("/predict")
def predict_priority(input: ComplaintInput):
    input_dict = {
        "desc_length": input.descriptionLength,
        "previous_count": input.previousCount,
        "days_open": input.daysOpen
    }

    # One-hot encoding manually
    for cat in categories:
        input_dict[f"category_{cat}"] = 1 if input.category == cat else 0

    for density in area_density:
        input_dict[f"area_density_{density}"] = 1 if input.areaDensity == density else 0

    input_df = pd.DataFrame([input_dict])
    input_df = input_df.reindex(columns=X.columns, fill_value=0)

    prediction = model.predict(input_df)[0]

    return {"predictedPriority": prediction}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
