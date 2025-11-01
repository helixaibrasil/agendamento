const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.code === 'SQLITE_CONSTRAINT') {
    return res.status(400).json({
      error: 'Violação de restrição do banco de dados',
      message: err.message
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Erro de validação',
      details: err.errors
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
