import pandas as pd

file_path = "/Users/adi/Desktop/amalfi/datasets/worldcitiespop.csv"

# Load the dataset
df = pd.read_csv(file_path, low_memory=False)

# Inspect columns to identify relevant ones
print(df.columns)

# Strip any leading/trailing spaces in the 'Country' column
df['Country'] = df['Country'].str.strip()

# Select required columns (adjust column names as per the dataset)
df_filtered = df[['City', 'Country', 'Population']]  # Use correct column names

# Drop rows with missing population values
df_filtered = df_filtered.dropna(subset=['Population'])

# Sort cities within each country by population in descending order
df_sorted = df_filtered.sort_values(by=['Country', 'Population'], ascending=[True, False])



# Instead of using apply(), we can group and aggregate without causing the deprecation warning
cities_by_country = df_sorted.groupby('Country').agg(lambda x: x.tolist()).to_dict()['City']

# Ensure to check if 'United States' exists in the dictionary
if 'it' in cities_by_country:
    print(cities_by_country['it'][:5])  # Top 5 cities in the US
else:
    print("The country 'United States' is not found in the dataset.")
