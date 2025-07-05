const storyItemStyle = new CSSStyleSheet()
storyItemStyle.replaceSync(`
  .card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
    height: 100%;
    width: 300px;
    background: white;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  .image-container img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
  }

  .content {
    padding: 16px;
  }

  .title {
    font-size: 18px;
    font-weight: bold;
    margin: 0 0 8px;
  }

  .meta-container {
    color: #666;
    margin-top: 16px;
  }

  .desc {
    font-size: 16px;
    color: #333;
    margin-bottom: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
  }

  .reporter, .date {
    font-size: 14px;
    color: #777;
    margin-bottom: 4px;
  }

  .button {
    display: inline-block;
    background: #4a90e2;
    color: white;
    padding: 8px 12px;
    border-radius: 5px;
    text-decoration: none;
    font-weight: bold;
    transition: background 0.3s
  }

  .button:hover {
    background: #0056b3;
  }`)

export default storyItemStyle
