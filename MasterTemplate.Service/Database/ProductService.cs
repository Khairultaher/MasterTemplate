using MasterTemplate.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterTemplate.Service.Database
{
    public class ProductService
    {
        private readonly ApplicationDbContext _context;
        ProductService(ApplicationDbContext context)
        {
            _context = context;
        }
    }
}
