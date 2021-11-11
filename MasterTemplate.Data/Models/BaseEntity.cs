using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterTemplate.Data.Models
{
    public class BaseEntity
    {
        [Key]
        public string Id { get; set; }

        public string CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }

        public string UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
