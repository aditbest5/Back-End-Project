# Gunakan image node.js resmi sebagai base image
FROM node:16

# Tentukan working directory di dalam container
WORKDIR /app

# Copy file package.json dan package-lock.json (jika ada) ke dalam container
COPY package*.json ./

# Install dependencies aplikasi
RUN npm install

# Install nodemon secara global
RUN npm install -g nodemon

# Copy seluruh source code aplikasi ke dalam container
COPY . .

# Expose port yang akan digunakan oleh aplikasi
EXPOSE 3000

# Tentukan perintah untuk menjalankan aplikasi dengan nodemon
CMD ["nodemon", "index.js"]
