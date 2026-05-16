import React, { useState } from 'react';
import { Download, Video, Loader2, CheckCircle, XCircle, ExternalLink, Clock, User, AlertCircle } from 'lucide-react';

export default function VideoDownloader() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Backend deployed on Render
  const BACKEND_URL = 'https://video-downloader-backend-c90x.onrender.com';

  const detectPlatform = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return '🎥 YouTube';
    if (url.includes('instagram.com')) return '📷 Instagram';
    if (url.includes('snapchat.com')) return '👻 Snapchat';
    if (url.includes('facebook.com') || url.includes('fb.watch')) return '📘 Facebook';
    if (url.includes('twitter.com') || url.includes('x.com')) return '🐦 Twitter';
    if (url.includes('tiktok.com')) return '🎵 TikTok';
    if (url.includes('vimeo.com')) return '🎬 Vimeo';
    if (url.includes('dailymotion.com')) return '📹 Dailymotion';
    return '🌐 Platform';
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const mb = (bytes / (1024 * 1024)).toFixed(2);
    return `${mb} MB`;
  };

  const handleDownload = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${BACKEND_URL}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to fetch video. Please check the URL and try again.');
      }
    } catch (err) {
      setError('Unable to connect to server. Please check your backend URL or try again later.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4">
      <div className="max-w-5xl mx-auto pt-8 pb-12">
        
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4 animate-bounce">
            <Video className="w-14 h-14 text-white mr-3" strokeWidth={2.5} />
            <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
              Video Downloader Pro
            </h1>
          </div>
          <p className="text-white text-xl font-medium drop-shadow">
            Download videos from 20+ platforms • HD Quality • No Watermarks • 100% Free
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 backdrop-blur-sm bg-opacity-95">
          
          <div className="mb-8">
            <p className="text-sm text-gray-600 font-semibold mb-3 uppercase tracking-wide">
              ✨ Supported Platforms
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                '🎥 YouTube', '📷 Instagram', '👻 Snapchat', '📘 Facebook', 
                '🐦 Twitter', '🎵 TikTok', '🎬 Vimeo', '📹 Dailymotion',
                '🔴 Reddit', '📱 LinkedIn'
              ].map(platform => (
                <span 
                  key={platform} 
                  className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-transform cursor-default"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-gray-800 font-bold mb-3 text-lg">
              📎 Enter Video URL
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleDownload()}
                placeholder="https://www.youtube.com/watch?v=example or any video link..."
                className="flex-1 px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition text-lg"
              />
              <button
                onClick={handleDownload}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="w-6 h-6" />
                    Get Video
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3 animate-pulse">
              <XCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-700 font-bold text-lg">Error</p>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg shadow-md">
              
              <div className="flex items-start gap-4 mb-6">
                <CheckCircle className="w-8 h-8 text-green-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-green-700 font-bold text-2xl mb-2">✅ Video Ready!</p>
                  <p className="text-gray-800 font-semibold text-lg mb-2">{result.title}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <span className="text-lg">{detectPlatform(url)}</span>
                    </span>
                    {result.duration > 0 && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDuration(result.duration)}
                      </span>
                    )}
                    {result.uploader && result.uploader !== 'Unknown' && (
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {result.uploader}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {result.thumbnail && (
                <img 
                  src={result.thumbnail} 
                  alt="Video thumbnail" 
                  className="w-full rounded-xl mb-6 shadow-lg max-h-80 object-cover"
                />
              )}

              {result.description && (
                <div className="mb-6 p-4 bg-white rounded-lg">
                  <p className="text-gray-600 text-sm italic">{result.description}</p>
                </div>
              )}

              <div className="space-y-3">
                <p className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Options (No Watermark):
                </p>
                
                {result.download_url && (
                  <a
                    href={result.download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-between group shadow-lg hover:shadow-xl font-bold text-lg"
                  >
                    <span className="flex items-center gap-2">
                      <Download className="w-6 h-6" />
                      Download Best Quality
                    </span>
                    <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                )}

                {result.formats && result.formats.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2 font-semibold">More Quality Options:</p>
                    {result.formats.slice(0, 3).map((format, idx) => (
                      <a
                        key={idx}
                        href={format.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-white border-2 border-green-300 text-gray-700 px-5 py-3 rounded-lg hover:bg-green-50 hover:border-green-500 transition-all mb-2 flex items-center justify-between group"
                      >
                        <div className="flex-1">
                          <span className="font-semibold">{format.quality}</span>
                          {format.filesize > 0 && (
                            <span className="text-sm text-gray-500 ml-2">
                              • {formatFileSize(format.filesize)}
                            </span>
                          )}
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-yellow-800 font-semibold">⚙️ Backend Setup Required</p>
                <p className="text-yellow-700 text-sm mt-1">
                  Please deploy the backend first and update the <code className="bg-yellow-200 px-1 rounded">BACKEND_URL</code> in the code.
                  See deployment instructions below.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl">
            <p className="text-blue-900 font-bold mb-3 text-lg">📖 How to Use:</p>
            <ol className="text-blue-800 space-y-2 list-decimal list-inside">
              <li>Copy the video URL from any supported platform</li>
              <li>Paste it in the input field above</li>
              <li>Click "Get Video" and wait for processing</li>
              <li>Choose your preferred quality and download (no watermarks!)</li>
            </ol>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-center text-white">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-xl">
            <p className="font-bold text-lg">🚀 Fast Downloads</p>
            <p className="text-sm">High-speed processing</p>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-xl">
            <p className="font-bold text-lg">🔒 100% Free</p>
            <p className="text-sm">No registration needed</p>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-xl">
            <p className="font-bold text-lg">✨ No Watermarks</p>
            <p className="text-sm">Original quality videos</p>
          </div>
        </div>
      </div>
    </div>
  );
}
