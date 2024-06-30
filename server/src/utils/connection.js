const fs = require('fs');
const path = require('path');

class PersistentMap extends Map {
  constructor(filePath) {
    super();
    this.filePath = filePath;
    this.load();
  }

  set(key, value) {
    super.set(key, value);
    this.save();
    return this;
  }

  delete(key) {
    const result = super.delete(key);
    this.save();
    return result;
  }

  clear() {
    super.clear();
    this.save();
  }

  load() {
    try {
      const data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
      for (const [key, value] of Object.entries(data)) {
        super.set(key, value);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('Error loading data:', error);
      }
    }
  }

  save() {
    const data = Object.fromEntries(this);
    fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf8');
  }
}

const clients = new PersistentMap(path.join(__dirname, 'clients.json'));
module.exports = clients;
