import os
import pandas as pd

# Get absolute path to the CSV relative to this script
base_dir = os.path.dirname(__file__)
file_path = os.path.join(base_dir, "datasets", "citypop.csv")

df = pd.read_csv(file_path)


# Step 2: Define function to get top 5 populous cities
def get_top_5_cities(country_code):
    country_code = country_code.lower()
    filtered_df = df[df['Country'] == country_code]
    if filtered_df.empty:
        return f"No data found for country code '{country_code}'"
    top_cities = filtered_df.nlargest(5, 'Population')
    return top_cities[['City', 'Population']]

# Step 3: Ask user for input and display results
if __name__ == "__main__":
    country_code_input = input("Enter the country code (ISO Alpha-2 format, e.g., 'us', 'in'): ").strip()
    result = get_top_5_cities(country_code_input)
    print("\nTop 5 Most Populous Cities:\n")
    print(result)
