const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();

app.use(express.json());

// Endpoint API 55five
app.post('/api/history', async (req, res) => {
  try {
    const payload = {
      pageSize: 10,
      pageNo: 1,
      typeId: 1, // WinGo 1 Menit
      language: 1,
      random: "cd90cd07be714e239a5096bcdc037e96",
      signature: "267896F0C59CB57A2BB48477C4692910",
      timestamp: Math.floor(Date.now() / 1000)
    };

    const response = await axios.post('https://api.55fiveapi.com/api/webapi/GetNoaverageEmerdList', payload, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
      },
      timeout: 6000
    });

    let apiData = response.data;
    let historyList = [];

    if (apiData && apiData.data && Array.isArray(apiData.data.list)) {
      historyList = apiData.data.list;
    } else if (apiData && Array.isArray(apiData.data)) {
      historyList = apiData.data;
    }

    if (historyList.length > 0) {
      return res.json({ success: true, list: historyList });
    }

    res.json({ success: false, list: [] });

  } catch (error) {
    console.error("❌ API Offline / Fail, Menggunakan Mock Data Fallback:", error.message);

    // Fallback Data Simulasi jika server API offline
    const currentPeriod = BigInt(Math.floor(Date.now() / 60000)) + 202607280000n;
    const mockList = Array.from({ length: 10 }, (_, i) => {
      const num = Math.floor(Math.random() * 10);
      return {
        issueNumber: (currentPeriod - BigInt(i)).toString(),
        number: num,
        colour: num === 0 ? "redviolet" : num === 5 ? "greenviolet" : num % 2 === 0 ? "red" : "green"
      };
    });

    return res.json({ success: true, list: mockList, isMock: true });
  }
});

// Khusus pengujian lokal di Termux
if (require.main === module) {
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;

      historyList = apiData.data;
    }

    if (historyList.length > 0) {
      return res.json({ success: true, list: historyList });
    }

    res.json({ success: false, list: [] });

  } catch (error) {
    console.error("❌ API Offline / Fail, Menggunakan Mock Data Fallback:", error.message);

    // Fallback Data Simulasi jika server API offline
    const currentPeriod = BigInt(Math.floor(Date.now() / 60000)) + 202607280000n;
    const mockList = Array.from({ length: 10 }, (_, i) => {
      const num = Math.floor(Math.random() * 10);
      return {
        issueNumber: (currentPeriod - BigInt(i)).toString(),
        number: num,
        colour: num === 0 ? "redviolet" : num === 5 ? "greenviolet" : num % 2 === 0 ? "red" : "green"
      };
    });

    return res.json({ success: true, list: mockList, isMock: true });
  }
});

// Route fallback untuk menyajikan halaman utama
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Menjalankan server lokal jika di-run manual (Termux/Localhost)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("\n=============================================");
    console.log("   ⚡ PEXX PREDICTOR (WINGO 1 MINUTE) RUNNING!");
    console.log("=============================================");
    console.log(` Buka Browser di HP kamu: http://localhost:${PORT}`);
    console.log(" Tekan CTRL + C di Termux jika ingin stop.");
    console.log("=============================================\n");
  });
}

// Export app agar bisa dibaca oleh Vercel Serverless
module.exports = app;
